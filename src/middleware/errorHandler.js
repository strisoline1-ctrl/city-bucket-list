import twilio from 'twilio';
import logger from '../utils/logger.js';

const { twiml: { VoiceResponse } } = twilio;

export function errorHandler(err, req, res, next) {
  logger.error({ err }, 'Unhandled error');

  // If Twilio is expecting a TwiML response, return one
  if (req.headers['x-twilio-signature'] || req.path.startsWith('/voice')) {
    const response = new VoiceResponse();
    response.say('We encountered a technical issue. Please call back shortly.');
    response.hangup();
    return res.type('text/xml').status(500).send(response.toString());
  }

  res.status(500).json({ error: 'Internal server error' });
}
