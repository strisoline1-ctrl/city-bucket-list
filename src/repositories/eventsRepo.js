import { getClient } from '../services/supabase.js';
import logger from '../utils/logger.js';

export async function logEvent({ callSid, callerPhone, callerName, type, details = {} }) {
  try {
    const { error } = await getClient().from('events').insert({
      call_sid: callSid,
      caller_phone: callerPhone,
      caller_name: callerName,
      type,
      details,
    });
    if (error) throw error;
  } catch (err) {
    logger.error({ err, callSid, type }, 'Failed to log event');
  }
}
