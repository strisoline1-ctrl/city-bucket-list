import { Router } from 'express';
import { twilioSignature } from '../middleware/twilioSignature.js';
import { updateBookingStatus } from '../repositories/bookingsRepo.js';
import { claimDriver } from '../repositories/driversRepo.js';
import { sendSms } from '../services/twilio.js';
import { dispatchRide } from '../services/dispatcher.js';
import logger from '../utils/logger.js';

const router = Router();
router.use(twilioSignature);

// Twilio inbound SMS — driver reply to a ride dispatch
router.post('/incoming', async (req, res) => {
  const { From, Body } = req.body;
  const reply = (Body || '').trim().toUpperCase();

  logger.info({ from: From, reply }, 'Driver SMS reply');

  // Parse booking ID from the original dispatch message if included
  // Format: "Reply YES to accept or NO to decline.\nBooking ID: <id>"
  // For now we look up the most recent pending booking for this driver's phone
  try {
    const { getClient } = await import('../services/supabase.js');
    const db = getClient();

    // Find the driver record
    const { data: driver } = await db
      .from('drivers')
      .select('id, name')
      .eq('phone', From)
      .single();

    if (!driver) {
      logger.warn({ from: From }, 'SMS from unknown driver');
      return res.sendStatus(204);
    }

    // Find their most recent dispatched booking
    const { data: booking } = await db
      .from('bookings')
      .select('*')
      .eq('driver_id', driver.id)
      .eq('status', 'dispatched')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!booking) {
      logger.warn({ driverId: driver.id }, 'No dispatched booking found for driver reply');
      return res.sendStatus(204);
    }

    if (reply.startsWith('YES')) {
      await updateBookingStatus(booking.id, 'confirmed');
      await sendSms(booking.caller_phone,
        `✅ Your driver ${driver.name} is on the way to ${booking.pickup}. Track your booking ID: ${booking.id}`
      );
      logger.info({ bookingId: booking.id, driverId: driver.id }, 'Driver accepted ride');
    } else if (reply.startsWith('NO')) {
      // Mark driver unavailable for this booking and re-dispatch
      await db.from('drivers').update({ is_available: true }).eq('id', driver.id);
      await updateBookingStatus(booking.id, 'pending');

      // Re-dispatch excluding this driver
      const newBooking = await dispatchRide({
        callerName: booking.caller_name,
        callerPhone: booking.caller_phone,
        pickup: { raw: booking.pickup, zone: 'unknown' },
        dropoff: { raw: booking.dropoff },
        isImmediate: booking.is_immediate,
      });

      logger.info({ oldBookingId: booking.id, newBookingId: newBooking.id }, 'Ride re-dispatched after driver decline');
    }
  } catch (err) {
    logger.error({ err, from: From }, 'Failed to process driver SMS reply');
  }

  res.sendStatus(204);
});

export default router;
