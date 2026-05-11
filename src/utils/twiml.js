import twilio from 'twilio';
import env from '../config/env.js';

const { twiml: { VoiceResponse } } = twilio;

/**
 * Build a TwiML Gather that plays ElevenLabs audio (if cached) or falls back to <Say>.
 */
export async function buildVoiceGather({ text, action = '/voice/gather', timeout = 5, speechTimeout = 'auto' }) {
  const response = new VoiceResponse();
  const gather = response.gather({
    input: 'speech',
    action,
    method: 'POST',
    timeout,
    speechTimeout,
    speechModel: 'phone_call',
    enhanced: 'true',
  });

  await appendVoice(gather, text);
  response.redirect({ method: 'POST' }, action);
  return response.toString();
}

/**
 * Build a TwiML response that speaks/plays and then hangs up.
 */
export async function buildVoiceHangup(text) {
  const response = new VoiceResponse();
  await appendVoice(response, text);
  response.hangup();
  return response.toString();
}

/**
 * Build a TwiML response that dials a number (live transfer).
 */
export async function buildDial(to) {
  const response = new VoiceResponse();
  response.say({ voice: 'Polly.Joanna', language: 'en-US' }, 'Please hold while I connect you to our team.');
  response.dial(to);
  return response.toString();
}

// ── Internal helpers ──────────────────────────────────────────────────────────

async function appendVoice(node, text) {
  if (env.ELEVENLABS_API_KEY && env.ELEVENLABS_VOICE_ID) {
    try {
      const { generateAudio, hashText } = await import('../services/elevenlabs.js');
      const { hash } = await generateAudio(text);
      node.play(`${env.PUBLIC_BASE_URL}/audio/${hash}.mp3`);
      return;
    } catch {
      // Fall through to <Say>
    }
  }
  node.say({ voice: 'Polly.Joanna', language: 'en-US' }, text);
}

// Legacy sync aliases kept for error handler (no ElevenLabs needed for error TwiML)
export function buildSayGather({ text, action = '/voice/gather' }) {
  const response = new VoiceResponse();
  const gather = response.gather({ input: 'speech', action, method: 'POST', timeout: 5, speechTimeout: 'auto', speechModel: 'phone_call', enhanced: 'true' });
  gather.say({ voice: 'Polly.Joanna', language: 'en-US' }, text);
  response.redirect({ method: 'POST' }, action);
  return response.toString();
}

export function buildSayHangup(text) {
  const response = new VoiceResponse();
  response.say({ voice: 'Polly.Joanna', language: 'en-US' }, text);
  response.hangup();
  return response.toString();
}
