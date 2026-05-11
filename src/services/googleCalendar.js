import { google } from 'googleapis';
import env from '../config/env.js';
import logger from '../utils/logger.js';

let _calendar = null;

function getCalendar() {
  if (_calendar) return _calendar;
  if (!env.GOOGLE_CLIENT_EMAIL || !env.GOOGLE_PRIVATE_KEY || !env.GOOGLE_CALENDAR_ID) {
    throw new Error('Google Calendar credentials not configured');
  }
  const auth = new google.auth.JWT({
    email: env.GOOGLE_CLIENT_EMAIL,
    key: env.GOOGLE_PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });
  _calendar = google.calendar({ version: 'v3', auth });
  return _calendar;
}

/**
 * Create a calendar event for a scheduled booking.
 * Returns the event ID.
 */
export async function createBookingEvent({ callerName, callerPhone, pickup, dropoff, scheduledAt }) {
  try {
    const startTime = new Date(scheduledAt);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1hr window

    const { data } = await getCalendar().events.insert({
      calendarId: env.GOOGLE_CALENDAR_ID,
      requestBody: {
        summary: `Ride: ${callerName}`,
        description: `Pickup: ${pickup}\nDrop-off: ${dropoff}\nCaller: ${callerPhone}`,
        start: { dateTime: startTime.toISOString(), timeZone: env.GOOGLE_CALENDAR_TIMEZONE },
        end: { dateTime: endTime.toISOString(), timeZone: env.GOOGLE_CALENDAR_TIMEZONE },
      },
    });

    logger.info({ eventId: data.id, callerName }, 'Calendar event created');
    return data.id;
  } catch (err) {
    logger.error({ err, callerName }, 'Failed to create calendar event');
    throw err;
  }
}
