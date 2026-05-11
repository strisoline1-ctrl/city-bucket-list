import { Router } from 'express';
import { createReadStream, existsSync } from 'fs';
import { generateAudio, getCachePath, isCached } from '../services/elevenlabs.js';
import logger from '../utils/logger.js';

const router = Router();

// GET /audio/:hash.mp3
router.get('/:hash.mp3', async (req, res) => {
  const { hash } = req.params;

  if (!/^[a-f0-9]{32}$/.test(hash)) {
    return res.status(400).send('Invalid hash');
  }

  const filePath = getCachePath(hash);

  if (isCached(hash)) {
    return streamFile(filePath, res);
  }

  // Cache miss — the hash was generated for a text we don't have here.
  // This shouldn't happen in normal flow since prewarm + generateAudio always
  // writes before the URL is returned to Twilio. Return 404 so Twilio falls back.
  logger.warn({ hash }, 'Audio cache miss on /audio route');
  res.status(404).send('Audio not found');
});

function streamFile(filePath, res) {
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  createReadStream(filePath).pipe(res);
}

export default router;
