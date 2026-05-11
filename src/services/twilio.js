import twilio from 'twilio';
import env from '../config/env.js';
import logger from '../utils/logger.js';

let _client = null;

function getClient() {
  if (!_client) _client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
  return _client;
}

export async function sendSms(to, body) {
  try {
    const msg = await getClient().messages.create({
      from: env.TWILIO_PHONE_NUMBER,
      to,
      body,
    });
    logger.info({ sid: msg.sid, to }, 'SMS sent');
    return msg;
  } catch (err) {
    logger.error({ err, to }, 'Failed to send SMS');
    throw err;
  }
}
