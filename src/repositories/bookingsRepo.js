import { getClient } from '../services/supabase.js';

export async function createBooking({ callerName, callerPhone, pickup, dropoff, scheduledAt, isImmediate, driverId, calendarEventId }) {
  const { data, error } = await getClient()
    .from('bookings')
    .insert({
      caller_name: callerName,
      caller_phone: callerPhone,
      pickup,
      dropoff,
      scheduled_at: scheduledAt ?? null,
      is_immediate: isImmediate,
      driver_id: driverId ?? null,
      calendar_event_id: calendarEventId ?? null,
      status: driverId ? 'dispatched' : 'confirmed',
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateBookingStatus(bookingId, status) {
  const { error } = await getClient()
    .from('bookings')
    .update({ status })
    .eq('id', bookingId);
  if (error) throw error;
}

export async function getBooking(bookingId) {
  const { data, error } = await getClient()
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single();
  if (error) throw error;
  return data;
}
