# City Bucket List — Voice Receptionist: Project Outline

> **Stack:** Node.js 20 (ESM) · Express · Twilio · ElevenLabs TTS · Supabase · Google Calendar  
> **Updated:** May 1, 2026

---

## Current Status

The call plumbing, state machine, and session layer are complete and tested. ElevenLabs is wired into the TwiML builder via a feature-flag check, but the service module and audio-serving route don't exist yet. All downstream side effects (driver dispatch, calendar booking, SMS) are stubbed.

---

## Phase 1 — Core Infrastructure ✅ Done

The foundation that everything else builds on.

- Express server with Twilio signature validation middleware
- In-memory session store with TTL (swap to Supabase via `SESSION_STORE=supabase`)
- Zod-validated environment config (`src/config/env.js`)
- Pino structured logger
- Health-check route (`GET /health`)

---

## Phase 2 — State Machine & Call Flow ✅ Done

A pure, side-effect-free transition function that can be unit-tested without I/O.

- States: `GREETING → COLLECT_NAME → COLLECT_INTENT → COLLECT_PICKUP → COLLECT_DROPOFF → [COLLECT_TIME] → CONFIRM → DISPATCH|BOOK → GOODBYE`
- Escalation: exceeding `MAX_REPROMPTS` in any state → `ESCALATE` → `<Dial>` transfer to owner
- Side-effect descriptors emitted by machine, executed by `handleTurn.js`
- Intent detection (ride now / scheduled booking / FAQ)
- chrono-node for natural language time parsing

---

## Phase 3 — Twilio Webhook Routes ✅ Done

- `POST /voice/incoming` — creates session, returns greeting TwiML
- `POST /voice/gather` — drives state machine, returns next TwiML
- `POST /voice/status` — cleans up session on call end
- TwiML builders: `buildVoiceGather`, `buildVoiceHangup`, `buildDial`
- Fallback: `<Say voice="Polly.Joanna">` when ElevenLabs is not configured

---

## Phase 4 — ElevenLabs Voice ⚠️ In Progress

Replace Polly TTS with natural ElevenLabs speech. The `twiml.js` hook is wired — it checks for `ELEVENLABS_API_KEY` + `ELEVENLABS_VOICE_ID` and calls `../services/elevenlabs.js` — but that module doesn't exist yet.

### 4a — ElevenLabs Service (`src/services/elevenlabs.js`)

Create the module that `twiml.js` already imports:

```js
export async function generateAudio(text)  // → { hash, filePath }
export function hashText(text)             // → SHA-256 hex string
```

Implementation details:
- Hash the prompt text (SHA-256) to use as the cache key and filename
- Check `AUDIO_CACHE_DIR` for `<hash>.mp3` before calling the API
- Call `POST https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}` with streaming response
- Write the MP3 stream to `AUDIO_CACHE_DIR/<hash>.mp3`
- Return `{ hash, filePath }` — `twiml.js` constructs the public URL

Key env vars (already in schema):
- `ELEVENLABS_API_KEY`
- `ELEVENLABS_VOICE_ID`
- `ELEVENLABS_MODEL_ID` (default: `eleven_turbo_v2_5`)
- `ELEVENLABS_OUTPUT_FORMAT` (default: `mp3_22050_32`)
- `AUDIO_CACHE_DIR` (default: `./audio-cache`)

### 4b — Audio Serving Route

Add `GET /audio/:hash.mp3` to serve cached audio files. Twilio's `<Play>` verb fetches the URL synchronously, so this route must respond quickly.

```js
// src/routes/audio.js
router.get('/:hash.mp3', async (req, res) => { /* stream from AUDIO_CACHE_DIR */ });
```

Mount at `/audio` in `server.js`. Set `Content-Type: audio/mpeg` and appropriate cache headers.

### 4c — Pre-warming (Optional, Recommended)

Pre-generate audio for the fixed prompts (greeting, goodbye, etc.) at server startup to eliminate first-call latency.

```js
// src/scripts/prewarm.js — run once on deploy or in server.js startup
for (const [state, text] of Object.entries(STATIC_PROMPTS)) {
  await generateAudio(text);
}
```

### 4d — Cache Management

- Set a max cache size or TTL (dynamic prompts like confirmations vary per caller)
- Static prompts (greeting, goodbye, etc.) are safe to cache indefinitely
- Dynamic prompts (caller name, addresses) generate unique hashes — cache grows over time without pruning

---

## Phase 5 — Side Effects / Integrations ⚠️ Stubbed

These are already invoked from `handleTurn.js`; they just need real implementations.

### 5a — SMS (`src/services/twilio.js`)

```js
export async function sendSms(to, body) { /* Twilio Messages.create */ }
```

Used for: owner notifications on dispatch/booking, rider confirmation texts.

### 5b — Driver Dispatch (`src/services/dispatcher.js`)

```js
export async function dispatchRide({ callerName, callerPhone, pickup, dropoff, isImmediate })
// → { id }  (bookingId written back to session)
```

Logic:
- Query Supabase `drivers` table for nearest available driver (use `FOR UPDATE SKIP LOCKED` to avoid race conditions between concurrent calls)
- Send SMS to driver via `sendSms`
- Insert row into `bookings` table
- Return booking record

### 5c — Google Calendar (`src/services/googleCalendar.js`)

```js
export async function createBookingEvent({ callerName, callerPhone, pickup, dropoff, scheduledAt })
// → calendarEventId
```

Uses Google Calendar API with a service account (`GOOGLE_CLIENT_EMAIL` + `GOOGLE_PRIVATE_KEY`).

### 5d — Supabase Repositories (`src/repositories/`)

Three repos already imported in `handleTurn.js`:

| File | Purpose |
|------|---------|
| `eventsRepo.js` | `logEvent()` — call_start, call_end, ride, booking events |
| `bookingsRepo.js` | `createBooking()` — persists confirmed bookings |
| `faqsRepo.js` | `findByKeywords()` — keyword search against FAQs table |

Schema already exists in `db/migrations/0001_init.sql`.

---

## Phase 6 — Production Hardening

- Switch `SESSION_STORE=supabase` for multi-instance deployments
- Rate limiting on webhook routes (prevent replay attacks)
- Audio cache eviction strategy (LRU or TTL-based cleanup job)
- Retry logic on ElevenLabs API failures (exponential backoff)
- Dead-letter handling: if ElevenLabs is down, fall through to Polly gracefully (already coded in `twiml.js` catch block)
- Structured error alerting (Sentry or similar)
- `TWILIO_VALIDATE_SIGNATURE=true` in production (already supported)

---

## Phase 7 — Observability & Analytics

- Call outcome reporting (completed bookings, escalations, drop-offs by state)
- Average call duration by intent
- FAQ hit/miss rates → surface new FAQ candidates
- ElevenLabs API latency and cache-hit rate tracking
- Supabase dashboard or simple `/admin/stats` endpoint

---

## Immediate Next Steps

1. **Create `src/services/elevenlabs.js`** — the one missing file blocking voice quality improvement
2. **Add `GET /audio/:hash.mp3` route** — required for `<Play>` to work
3. **Create `src/repositories/eventsRepo.js`**, `bookingsRepo.js`, `faqsRepo.js`
4. **Create `src/services/twilio.js`** (SMS send)
5. **Set `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID`** in `.env` and test end-to-end

---

## Environment Variables Reference

| Variable | Required | Notes |
|----------|----------|-------|
| `PUBLIC_BASE_URL` | ✅ | ngrok URL in dev, production domain in prod |
| `TWILIO_ACCOUNT_SID` | ✅ | |
| `TWILIO_AUTH_TOKEN` | ✅ | |
| `TWILIO_PHONE_NUMBER` | ✅ | |
| `OWNER_PHONE` | ✅ | SMS notifications |
| `ESCALATE_PHONE` | ✅ | Live transfer target |
| `ELEVENLABS_API_KEY` | Phase 4 | |
| `ELEVENLABS_VOICE_ID` | Phase 4 | |
| `ELEVENLABS_MODEL_ID` | Phase 4 | Default: `eleven_turbo_v2_5` |
| `AUDIO_CACHE_DIR` | Phase 4 | Default: `./audio-cache` |
| `SUPABASE_URL` | Phase 5 | |
| `SUPABASE_SERVICE_ROLE_KEY` | Phase 5 | |
| `GOOGLE_CLIENT_EMAIL` | Phase 5 | |
| `GOOGLE_PRIVATE_KEY` | Phase 5 | Base64-encoded PEM |
| `GOOGLE_CALENDAR_ID` | Phase 5 | |
| `SESSION_STORE` | Phase 6 | `memory` → `supabase` for prod |
