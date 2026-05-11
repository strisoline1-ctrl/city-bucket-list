import { createHash } from 'crypto';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { pipeline } from 'stream/promises';
import env from '../config/env.js';
import logger from '../utils/logger.js';

function ensureCacheDir() {
  if (!existsSync(env.AUDIO_CACHE_DIR)) {
    mkdirSync(env.AUDIO_CACHE_DIR, { recursive: true });
  }
}

export function hashText(text) {
  return createHash('sha256')
    .update(`${text}|${env.ELEVENLABS_VOICE_ID}|${env.ELEVENLABS_MODEL_ID}`)
    .digest('hex')
    .slice(0, 32);
}

export function getCachePath(hash) {
  return join(env.AUDIO_CACHE_DIR, `${hash}.mp3`);
}

export function isCached(hash) {
  return existsSync(getCachePath(hash));
}

/**
 * Generate TTS audio and write to disk cache. Returns the file path.
 */
export async function generateAudio(text) {
  if (!env.ELEVENLABS_API_KEY || !env.ELEVENLABS_VOICE_ID) {
    throw new Error('ElevenLabs credentials not configured');
  }

  ensureCacheDir();
  const hash = hashText(text);
  const filePath = getCachePath(hash);

  if (existsSync(filePath)) {
    return { hash, filePath, fromCache: true };
  }

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${env.ELEVENLABS_VOICE_ID}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': env.ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: env.ELEVENLABS_MODEL_ID,
      output_format: env.ELEVENLABS_OUTPUT_FORMAT,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`ElevenLabs API error ${response.status}: ${body}`);
  }

  await pipeline(response.body, createWriteStream(filePath));
  logger.info({ hash, text: text.slice(0, 60) }, 'ElevenLabs audio generated');

  return { hash, filePath, fromCache: false };
}
