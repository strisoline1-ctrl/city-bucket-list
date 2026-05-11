/**
 * Pre-generates ElevenLabs audio for all static prompts at startup.
 * Skips if ElevenLabs credentials are not configured.
 */
import { getPrompt } from '../flows/prompts.js';
import { generateAudio, isCached, hashText } from '../services/elevenlabs.js';
import { STATES } from '../config/constants.js';
import env from '../config/env.js';
import logger from '../utils/logger.js';

const STATIC_STATES = [
  STATES.GREETING,
  STATES.COLLECT_NAME,
  STATES.COLLECT_PICKUP,
  STATES.COLLECT_DROPOFF,
  STATES.COLLECT_TIME,
  STATES.ESCALATE,
  STATES.GOODBYE,
  STATES.OFFER_MORE,
];

// Synthetic session used only to render prompts with no caller-specific data
const STUB_SESSION = {
  state: null, attempts: 0,
  data: { name: 'there', pickup: { raw: 'your location' }, dropoff: { raw: 'your destination' }, scheduledAt: null, isImmediate: false },
};

export async function prewarmAudio() {
  if (!env.ELEVENLABS_API_KEY || !env.ELEVENLABS_VOICE_ID) {
    logger.info('ElevenLabs not configured — skipping audio pre-warm');
    return;
  }

  logger.info('Pre-warming ElevenLabs audio cache...');
  let generated = 0;
  let skipped = 0;

  for (const state of STATIC_STATES) {
    try {
      const text = getPrompt(state, STUB_SESSION);
      const hash = hashText(text);
      if (isCached(hash)) {
        skipped++;
        continue;
      }
      await generateAudio(text);
      generated++;
    } catch (err) {
      logger.error({ err, state }, 'Failed to pre-warm audio for state');
    }
  }

  logger.info({ generated, skipped }, 'Audio pre-warm complete');
}
