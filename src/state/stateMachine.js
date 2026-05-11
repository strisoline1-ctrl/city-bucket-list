import { STATES, INTENTS, BOOKING_KEYWORDS, RIDE_NOW_KEYWORDS, FAQ_KEYWORDS, ZONE_KEYWORDS } from '../config/constants.js';
import env from '../config/env.js';
import * as chronoNode from 'chrono-node';

/**
 * Pure state machine transition.
 * Returns { nextState, sessionPatch, sideEffects, prompt }
 * No I/O — all side effects are descriptors executed by handleTurn.js
 */
export function transition(session, speechResult) {
  const speech = (speechResult || '').toLowerCase().trim();
  const { state, attempts, data } = session;

  // Reprompt guard
  if (attempts >= env.MAX_REPROMPTS && state !== STATES.ESCALATE && state !== STATES.GOODBYE) {
    return {
      nextState: STATES.ESCALATE,
      sessionPatch: {},
      sideEffects: [],
      prompt: null,
    };
  }

  switch (state) {
    case STATES.GREETING:
      return {
        nextState: STATES.COLLECT_NAME,
        sessionPatch: {},
        sideEffects: [],
        prompt: null,
      };

    case STATES.COLLECT_NAME: {
      const name = extractName(speech);
      if (!name) {
        return reprompt(session, 'I did not catch your name. Could you please repeat it?');
      }
      return {
        nextState: STATES.COLLECT_INTENT,
        sessionPatch: { name },
        sideEffects: [],
        prompt: null,
      };
    }

    case STATES.COLLECT_INTENT: {
      const intent = detectIntent(speech);
      if (!intent) {
        return reprompt(session, `I can help you book a ride or answer questions. What would you like to do?`);
      }
      if (intent === INTENTS.FAQ) {
        return {
          nextState: STATES.FAQ_ANSWER,
          sessionPatch: { intent, faqQuery: speech },
          sideEffects: [{ type: 'faq_lookup', query: speech }],
          prompt: null,
        };
      }
      return {
        nextState: STATES.COLLECT_PICKUP,
        sessionPatch: { intent, isImmediate: intent === INTENTS.RIDE_NOW },
        sideEffects: [],
        prompt: null,
      };
    }

    case STATES.COLLECT_PICKUP: {
      if (!speech) {
        return reprompt(session, 'Where will you be picked up from?');
      }
      return {
        nextState: STATES.COLLECT_DROPOFF,
        sessionPatch: { pickup: { raw: speechResult, zone: detectZone(speech) } },
        sideEffects: [],
        prompt: null,
      };
    }

    case STATES.COLLECT_DROPOFF: {
      if (!speech) {
        return reprompt(session, 'Where would you like to go?');
      }
      const nextState = data.isImmediate ? STATES.CONFIRM : STATES.COLLECT_TIME;
      return {
        nextState,
        sessionPatch: { dropoff: { raw: speechResult } },
        sideEffects: [],
        prompt: null,
      };
    }

    case STATES.COLLECT_TIME: {
      const time = parseTime(speech);
      if (!time) {
        return reprompt(session, 'When would you like to be picked up? For example, tomorrow at 3 PM.');
      }
      return {
        nextState: STATES.CONFIRM,
        sessionPatch: { scheduledAt: time },
        sideEffects: [],
        prompt: null,
      };
    }

    case STATES.CONFIRM: {
      const confirmed = detectYesNo(speech);
      if (confirmed === null) {
        return reprompt(session, 'Just say yes to confirm or no to start over.');
      }
      if (!confirmed) {
        return {
          nextState: STATES.COLLECT_PICKUP,
          sessionPatch: { pickup: null, dropoff: null, scheduledAt: null },
          sideEffects: [],
          prompt: null,
        };
      }
      const terminal = data.isImmediate ? STATES.DISPATCH : STATES.BOOK;
      return {
        nextState: terminal,
        sessionPatch: {},
        sideEffects: buildTerminalEffects(data, terminal),
        prompt: null,
      };
    }

    case STATES.FAQ_ANSWER:
      return {
        nextState: STATES.OFFER_MORE,
        sessionPatch: {},
        sideEffects: [],
        prompt: null,
      };

    case STATES.OFFER_MORE: {
      if (detectYesNo(speech) === true) {
        return {
          nextState: STATES.COLLECT_INTENT,
          sessionPatch: { intent: null, faqQuery: null },
          sideEffects: [],
          prompt: null,
        };
      }
      return {
        nextState: STATES.GOODBYE,
        sessionPatch: {},
        sideEffects: [],
        prompt: null,
      };
    }

    case STATES.DISPATCH:
    case STATES.BOOK:
    case STATES.GOODBYE:
    case STATES.ESCALATE:
      return { nextState: state, sessionPatch: {}, sideEffects: [], prompt: null };

    default:
      return { nextState: STATES.GREETING, sessionPatch: {}, sideEffects: [], prompt: null };
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function reprompt(session, prompt) {
  return {
    nextState: session.state,
    sessionPatch: {},
    sideEffects: [],
    prompt,
    isReprompt: true,
  };
}

function extractName(speech) {
  // Accept any non-empty speech as a name; strip filler words
  const cleaned = speech.replace(/^(my name is|i'm|i am|this is)\s+/i, '').trim();
  return cleaned.length >= 2 ? cleaned : null;
}

function detectIntent(speech) {
  if (RIDE_NOW_KEYWORDS.some(k => speech.includes(k))) return INTENTS.RIDE_NOW;
  if (BOOKING_KEYWORDS.some(k => speech.includes(k))) return INTENTS.BOOKING;
  if (FAQ_KEYWORDS.some(k => speech.includes(k))) return INTENTS.FAQ;
  return null;
}

function detectZone(speech) {
  for (const [zone, keywords] of Object.entries(ZONE_KEYWORDS)) {
    if (keywords.some(k => speech.includes(k))) return zone;
  }
  return 'unknown';
}

function detectYesNo(speech) {
  if (/\b(yes|yeah|yep|correct|confirm|sounds good|that's right)\b/i.test(speech)) return true;
  if (/\b(no|nope|wrong|change|redo|start over)\b/i.test(speech)) return false;
  return null;
}

function parseTime(speech) {
  try {
    const result = chronoNode.parseDate(speech);
    return result ? result.toISOString() : null;
  } catch {
    return null;
  }
}

function buildTerminalEffects(data, terminal) {
  const effects = [];
  if (terminal === STATES.DISPATCH) {
    effects.push({ type: 'dispatch_driver', pickup: data.pickup, dropoff: data.dropoff });
    effects.push({ type: 'sms_owner', message: `New ride request: ${data.name} from ${data.pickup?.raw} to ${data.dropoff?.raw}` });
    effects.push({ type: 'log_event', eventType: 'ride', details: data });
  } else {
    effects.push({ type: 'calendar_event', booking: data });
    effects.push({ type: 'sms_owner', message: `New booking: ${data.name} from ${data.pickup?.raw} to ${data.dropoff?.raw} at ${data.scheduledAt}` });
    effects.push({ type: 'log_event', eventType: 'booking', details: data });
  }
  return effects;
}
