import { getSession, setSession, createSession, endSession } from '../state/sessionStore.js';
import { transition } from '../state/stateMachine.js';
import { getPrompt } from './prompts.js';
import { buildVoiceGather, buildVoiceHangup, buildDial } from '../utils/twiml.js';
import { STATES } from '../config/constants.js';
import env from '../config/env.js';
import logger from '../utils/logger.js';

async function executeEffects(effects, session) {
  for (const effect of effects) {
    try {
      switch (effect.type) {
        case 'log_event': {
          if (env.SUPABASE_URL) {
            const { logEvent } = await import('../repositories/eventsRepo.js');
            await logEvent({
              callSid: session.callSid,
              callerPhone: session.callerPhone,
              callerName: session.data.name,
              type: effect.eventType,
              details: effect.details,
            });
          }
          break;
        }
        case 'sms_owner': {
          const { sendSms } = await import('../services/twilio.js');
          await sendSms(env.OWNER_PHONE, effect.message);
          break;
        }
        case 'dispatch_driver': {
          const { dispatchRide } = await import('../services/dispatcher.js');
          const booking = await dispatchRide({
            callerName: session.data.name,
            callerPhone: session.callerPhone,
            pickup: effect.pickup,
            dropoff: effect.dropoff,
            isImmediate: true,
          });
          // Patch bookingId back onto session data
          session.data.bookingId = booking.id;
          await setSession(session.callSid, session);
          break;
        }
        case 'calendar_event': {
          const { createBookingEvent } = await import('../services/googleCalendar.js');
          const { createBooking } = await import('../repositories/bookingsRepo.js');
          const calendarEventId = await createBookingEvent({
            callerName: session.data.name,
            callerPhone: session.callerPhone,
            pickup: effect.booking.pickup?.raw,
            dropoff: effect.booking.dropoff?.raw,
            scheduledAt: effect.booking.scheduledAt,
          });
          const booking = await createBooking({
            callerName: session.data.name,
            callerPhone: session.callerPhone,
            pickup: effect.booking.pickup?.raw,
            dropoff: effect.booking.dropoff?.raw,
            scheduledAt: effect.booking.scheduledAt,
            isImmediate: false,
            calendarEventId,
          });
          session.data.bookingId = booking.id;
          await setSession(session.callSid, session);
          break;
        }
        case 'faq_lookup': {
          if (env.SUPABASE_URL) {
            const { findByKeywords } = await import('../repositories/faqsRepo.js');
            const faq = await findByKeywords(effect.query);
            session.data.faqAnswer = faq?.answer ?? null;
            await setSession(session.callSid, session);
          }
          break;
        }
        default:
          logger.warn({ effect }, 'Unknown side effect type');
      }
    } catch (err) {
      logger.error({ err, effectType: effect.type }, 'Side effect failed');
    }
  }
}

export async function handleIncoming(callSid, callerPhone) {
  const session = createSession(callSid, callerPhone);
  await setSession(callSid, session);

  if (env.SUPABASE_URL) {
    const { logEvent } = await import('../repositories/eventsRepo.js');
    await logEvent({ callSid, callerPhone, type: 'call_start', details: {} }).catch(() => {});
  }

  logger.info({ callSid, callerPhone }, 'New call');
  const promptText = getPrompt(STATES.GREETING, session);
  return buildVoiceGather({ text: promptText });
}

export async function handleGather(callSid, speechResult) {
  let session = await getSession(callSid);

  if (!session) {
    logger.warn({ callSid }, 'Session not found; creating fresh session');
    session = createSession(callSid, 'unknown');
  }

  logger.info({ callSid, state: session.state, speechResult }, 'Turn received');

  const result = transition(session, speechResult);
  const { nextState, sessionPatch, sideEffects, prompt, isReprompt } = result;

  const updatedSession = {
    ...session,
    state: nextState,
    attempts: isReprompt ? session.attempts + 1 : 0,
    data: { ...session.data, ...sessionPatch },
  };
  await setSession(callSid, updatedSession);

  if (sideEffects?.length) {
    await executeEffects(sideEffects, updatedSession);
  }

  // Use FAQ answer as override prompt if available
  const faqOverride = nextState === STATES.FAQ_ANSWER
    ? updatedSession.data.faqAnswer
    : null;

  return buildTwimlForState(nextState, updatedSession, faqOverride ?? prompt);
}

export async function handleCallEnd(callSid, callStatus) {
  const session = await getSession(callSid);
  if (env.SUPABASE_URL && session) {
    const { logEvent } = await import('../repositories/eventsRepo.js');
    await logEvent({
      callSid, callerPhone: session.callerPhone,
      callerName: session.data.name,
      type: 'call_end',
      details: { callStatus, finalState: session.state },
    }).catch(() => {});
  }
  await endSession(callSid);
}

async function buildTwimlForState(state, session, overridePrompt = null) {
  const text = getPrompt(state, session, overridePrompt);

  const terminalStates = [STATES.DISPATCH, STATES.BOOK, STATES.GOODBYE];
  if (terminalStates.includes(state)) {
    return buildVoiceHangup(text);
  }

  if (state === STATES.ESCALATE) {
    return buildDial(env.ESCALATE_PHONE);
  }

  return buildVoiceGather({ text });
}
