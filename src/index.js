import { createApp } from './app.js';
import env from './config/env.js';
import logger from './utils/logger.js';
import { prewarmAudio } from './workers/prewarmAudio.js';

const app = createApp();

// Pre-warm ElevenLabs audio cache before accepting traffic
prewarmAudio().then(() => {
  app.listen(env.PORT, () => {
    logger.info({ port: env.PORT, env: env.NODE_ENV }, 'City Bucket List receptionist started');
  });
}).catch(err => {
  logger.error({ err }, 'Startup failed');
  process.exit(1);
});
