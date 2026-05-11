import twilio from 'twilio';
import env from '../config/env.js';
import logger from '../utils/logger.js';

export function twilioSignature(req, res, next) {
  if (!env.TWILIO_VALIDATE_SIGNATURE || env.NODE_ENV === 'test') {
    return next();
  }

  const url = `${env.PUBLIC_BASE_URL}${req.path}`;
  const signature = req.headers['x-twilio-signature'] || '';
  const params = req.body || {};

  const valid = twilio.validateRequest(env.TWILIO_AUTH_TOKEN, signature, url, params);
  if (!valid) {
    logger.warn({ url, signature: signature.slice(0, 8) + '...' }, 'Invalid Twilio signature');
    return res.status(403).send('Forbidden');
  }
  next();
}
