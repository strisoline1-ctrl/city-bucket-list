import express from 'express';
import pinoHttp from 'pino-http';
import logger from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import voiceRouter from './routes/voice.js';
import smsRouter from './routes/sms.js';
import audioRouter from './routes/audio.js';
import healthRouter from './routes/health.js';
import driverCardRouter from './routes/driverCard.js';
import dashboardRouter from './routes/dashboard.js';

export function createApp() {
  const app = express();

  // Required for correct Twilio signature validation behind a reverse proxy
  app.set('trust proxy', 1);

  app.use(pinoHttp({ logger }));

  // Twilio sends application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use('/healthz', healthRouter);
  app.use('/voice', voiceRouter);
  app.use('/sms', smsRouter);
  app.use('/audio', audioRouter);
  app.use('/d', driverCardRouter);
  app.use('/dashboard', dashboardRouter);

  app.use(errorHandler);

  return app;
}
