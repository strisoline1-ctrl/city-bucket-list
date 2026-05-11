# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

City Bucket List Receptionist — an automated phone call receptionist for a ride/transportation service. Callers dial in, the system collects their info, and either books a scheduled ride (Google Calendar) or dispatches an immediate ride to the nearest driver via SMS. Every interaction is logged in Supabase.

## Stack

- **Runtime**: Node.js 20+ (ESM — all files use `import/export`)
- **Framework**: Express
- **Phone/SMS**: Twilio (TwiML webhooks for inbound calls, outbound SMS)
- **Voice**: ElevenLabs TTS (Phase 4 — currently using Twilio `<Say>` as placeholder)
- **Database**: Supabase (Postgres)
- **Calendar**: Google Calendar API (scheduled bookings)

## Commands

```bash
npm install          # install dependencies
npm run dev          # start with --watch (auto-restart on changes)
npm start            # production start
npm test             # run tests (Node built-in test runner)
```

## Architecture

### Call Flow
```
POST /voice/incoming  →  handleIncoming()  →  session created, greeting TwiML
POST /voice/gather    →  handleGather()    →  stateMachine.transition() → side effects → next TwiML
POST /voice/status    →  session cleanup
```

State progression: `GREETING → COLLECT_NAME → COLLECT_INTENT → COLLECT_PICKUP → COLLECT_DROPOFF → [COLLECT_TIME] → CONFIRM → DISPATCH or BOOK → GOODBYE`

Exceeding `MAX_REPROMPTS` in any state triggers `ESCALATE` → `<Dial>` to owner.

### Key Files

| File | Purpose |
|------|---------|
| `src/state/stateMachine.js` | Pure transition function — no I/O, returns `{ nextState, sessionPatch, sideEffects }` |
| `src/flows/handleTurn.js` | Orchestrator — loads session, calls machine, executes side effects, builds TwiML |
| `src/flows/prompts.js` | Spoken text for each state |
| `src/utils/twiml.js` | TwiML builders (`buildSayGather`, `buildSayHangup`, `buildDial`) |
| `src/middleware/twilioSignature.js` | Validates `X-Twilio-Signature` on all Twilio routes |
| `src/config/env.js` | Loads + validates all env vars via Zod; exits on invalid config |
| `db/migrations/0001_init.sql` | Full Postgres schema (drivers, events, bookings, call_sessions, faqs) |

### Side Effects Pattern
`stateMachine.js` emits effect descriptors (e.g. `{ type: 'sms_owner', message: '...' }`). `handleTurn.js` executes them. This keeps the machine unit-testable. Current effects are stubs; real service calls added in Phase 5.

### Session Store
Defaults to in-memory (`SESSION_STORE=memory`). Switch to `SESSION_STORE=supabase` for multi-instance / production.

## Environment Setup

Copy `.env.example` to `.env` and fill in values. Required for Phase 1: `PUBLIC_BASE_URL`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`, `OWNER_PHONE`, `ESCALATE_PHONE`.

`GOOGLE_PRIVATE_KEY` must be base64-encoded; `config/env.js` decodes it automatically.

## Local Development with Twilio

Twilio webhooks need a public HTTPS URL. Use ngrok:
```bash
ngrok http 3000
# then set PUBLIC_BASE_URL=https://<your-ngrok-id>.ngrok.io in .env
# and update the Twilio number's webhook URL in the Twilio console
```

## Database

Run `db/migrations/0001_init.sql` in Supabase SQL editor to create the schema.  
Seed FAQs: `db/seeds/faqs.sql`.

Driver dispatch uses `FOR UPDATE SKIP LOCKED` to prevent race conditions when two calls arrive simultaneously.
