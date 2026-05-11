import { Router } from 'express';
import { twilioSignature } from '../middleware/twilioSignature.js';
import { handleIncoming, handleGather, handleCallEnd } from '../flows/handleTurn.js';
import { buildSayHangup } from '../utils/twiml.js';
import logger from '../utils/logger.js';

const router = Router();
router.use(twilioSignature);

// Twilio: "A call comes in"
router.post('/incoming', async (req, res) => {
  const { CallSid, From } = req.body;
  logger.info({ CallSid, From }, 'Incoming call');

  const twiml = await handleIncoming(CallSid, From);
  res.type('text/xml').send(twiml);
});

// Twilio: speech input collected
router.post('/gather', async (req, res) => {
  const { CallSid, SpeechResult } = req.body;
  logger.info({ CallSid, SpeechResult }, 'Gather result');

  const twiml = await handleGather(CallSid, SpeechResult || '');
  res.type('text/xml').send(twiml);
});

// Twilio: call status callback
router.post('/status', async (req, res) => {
  const { CallSid, CallStatus } = req.body;
  logger.info({ CallSid, CallStatus }, 'Call status update');

  await handleCallEnd(CallSid, CallStatus);

  res.sendStatus(204);
});

// Twilio: fallback if primary webhook fails
router.post('/fallback', (req, res) => {
  logger.warn({ body: req.body }, 'Twilio fallback triggered');
  const twiml = buildSayHangup('We are experiencing technical difficulties. Please call back shortly.');
  res.type('text/xml').send(twiml);
});

export default router;
