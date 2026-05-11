import pino from 'pino';
import env from '../config/env.js';

const logger = pino({
  level: env.LOG_LEVEL,
  redact: ['req.headers.authorization', 'body.AccountSid', 'body.AuthToken'],
  ...(env.NODE_ENV === 'development' && {
    transport: { target: 'pino-pretty', options: { colorize: true } },
  }),
});

export default logger;
