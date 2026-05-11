import { claimDriver } from '../repositories/driversRepo.js';
import { createBooking } from '../repositories/bookingsRepo.js';
import { sendSms } from './twilio.js';
import env from '../config/env.js';
import logger from '../utils/logger.js';

/**
 * Find the nearest available driver by zone, create a booking, and SMS the driver.
 * Returns the created booking.
 */
export async function dispatchRide({ callerName, callerPhone, pickup, dropoff, isImmediate = true }) {
  const zone = pickup?.zone ?? 'unknown';
  const driver = await claimDriver(zone);

  if (!driver) {
    logger.warn({ zone }, 'No available drivers');
    await sendSms(env.OWNER_PHONE,
      `⚠️ No drivers available for ride: ${callerName} from ${pickup?.raw} to ${dropoff?.raw}. Please assign manually.`
    );
    // Still create the booking so it can be tracked
    return createBooking({
      callerName, callerPhone,
      pickup: pickup?.raw, dropoff: dropoff?.raw,
      isImmediate, status: 'pending',
    });
  }

  const booking = await createBooking({
    callerName, callerPhone,
    pickup: pickup?.raw, dropoff: dropoff?.raw,
    isImmediate, driverId: driver.id,
  });

  await sendSms(driver.phone,
    `🚗 New ride: ${callerName}\nPickup: ${pickup?.raw}\nDrop-off: ${dropoff?.raw}\nReply YES to accept or NO to decline.\nBooking ID: ${booking.id}`
  );

  logger.info({ bookingId: booking.id, driverId: driver.id }, 'Ride dispatched');
  return booking;
}
