import { STATES } from '../config/constants.js';

/**
 * Returns the spoken prompt text for each state.
 * Used by handleTurn to build TwiML <Say> (or <Play> once ElevenLabs is wired).
 */
export function getPrompt(state, session, overrideText = null) {
  if (overrideText) return overrideText;

  const { data } = session;

  switch (state) {
    case STATES.GREETING:
      return `Thank you for calling City Bucket List. I'm your virtual receptionist. How can I help you today?`;

    case STATES.COLLECT_NAME:
      return `Could you please tell me your name?`;

    case STATES.COLLECT_INTENT:
      return `Hi ${data.name}! Are you looking to book a scheduled ride, request a ride right now, or do you have a question?`;

    case STATES.COLLECT_PICKUP:
      return `Great! What is your pickup location?`;

    case STATES.COLLECT_DROPOFF:
      return `And where are you heading?`;

    case STATES.COLLECT_TIME:
      return `When would you like to be picked up? Please say a date and time, for example, tomorrow at 3 PM.`;

    case STATES.CONFIRM: {
      const time = data.isImmediate ? 'right now' : `at ${formatTime(data.scheduledAt)}`;
      return `Just to confirm — ${data.name}, pickup from ${data.pickup?.raw}, going to ${data.dropoff?.raw}, ${time}. Does that sound right?`;
    }

    case STATES.DISPATCH:
      return `Perfect! I'm finding the nearest available driver and sending them your way. You'll receive a text shortly. Safe travels!`;

    case STATES.BOOK:
      return `Your ride has been booked! You'll receive a confirmation text shortly. Is there anything else I can help you with?`;

    case STATES.FAQ_ANSWER:
      return `I'm looking that up for you now.`;

    case STATES.OFFER_MORE:
      return `Is there anything else I can help you with?`;

    case STATES.ESCALATE:
      return `Let me connect you with a team member who can better assist you.`;

    case STATES.GOODBYE:
      return `Thank you for calling City Bucket List. Have a wonderful day!`;

    default:
      return `I'm sorry, I didn't understand. Let me connect you with our team.`;
  }
}

function formatTime(iso) {
  if (!iso) return 'your requested time';
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}
