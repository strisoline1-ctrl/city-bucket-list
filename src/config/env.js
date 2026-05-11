import 'dotenv/config';
import { z } from 'zod';

const TEST_DEFAULTS = {
  PORT: 3000, NODE_ENV: 'test', PUBLIC_BASE_URL: 'http://localhost:3000',
  LOG_LEVEL: 'silent', TWILIO_ACCOUNT_SID: 'ACtest', TWILIO_AUTH_TOKEN: 'test',
  TWILIO_PHONE_NUMBER: '+15550000000', TWILIO_VALIDATE_SIGNATURE: false,
  OWNER_PHONE: '+15550001111', ESCALATE_PHONE: '+15550001111',
  SESSION_TTL_MINUTES: 30, MAX_REPROMPTS: 3, SESSION_STORE: 'memory',
  AUDIO_CACHE_DIR: './audio-cache', GOOGLE_CALENDAR_TIMEZONE: 'America/Los_Angeles',
  ELEVENLABS_MODEL_ID: 'eleven_turbo_v2_5', ELEVENLABS_OUTPUT_FORMAT: 'mp3_22050_32',
  DASHBOARD_USER: 'admin', DASHBOARD_PASSWORD: undefined,
};

const schema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PUBLIC_BASE_URL: z.string().url(),
  LOG_LEVEL: z.string().default('info'),

  TWILIO_ACCOUNT_SID: z.string().min(1),
  TWILIO_AUTH_TOKEN: z.string().min(1),
  TWILIO_PHONE_NUMBER: z.string().min(1),
  TWILIO_VALIDATE_SIGNATURE: z.string().transform(v => v !== 'false').default('true'),

  ELEVENLABS_API_KEY: z.string().optional(),
  ELEVENLABS_VOICE_ID: z.string().optional(),
  ELEVENLABS_MODEL_ID: z.string().default('eleven_turbo_v2_5'),
  ELEVENLABS_OUTPUT_FORMAT: z.string().default('mp3_22050_32'),

  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  GOOGLE_CLIENT_EMAIL: z.string().optional(),
  GOOGLE_PRIVATE_KEY: z.string().optional().transform(v =>
    v ? Buffer.from(v, 'base64').toString('utf8') : undefined
  ),
  GOOGLE_CALENDAR_ID: z.string().optional(),
  GOOGLE_CALENDAR_TIMEZONE: z.string().default('America/Los_Angeles'),

  OWNER_PHONE: z.string().min(1),
  ESCALATE_PHONE: z.string().min(1),

  SESSION_TTL_MINUTES: z.coerce.number().default(30),
  MAX_REPROMPTS: z.coerce.number().default(3),
  SESSION_STORE: z.enum(['memory', 'supabase']).default('memory'),
  AUDIO_CACHE_DIR: z.string().default('./audio-cache'),

  DASHBOARD_USER: z.string().default('admin'),
  DASHBOARD_PASSWORD: z.string().optional(),
});

const parsed = schema.safeParse(process.env);

let config;
if (!parsed.success) {
  if (process.env.NODE_ENV === 'test') {
    config = TEST_DEFAULTS;
  } else {
    console.error('Invalid environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
  }
} else {
  config = parsed.data;
}

export default config;
