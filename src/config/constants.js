export const STATES = {
  GREETING: 'GREETING',
  COLLECT_NAME: 'COLLECT_NAME',
  COLLECT_INTENT: 'COLLECT_INTENT',
  COLLECT_PICKUP: 'COLLECT_PICKUP',
  COLLECT_DROPOFF: 'COLLECT_DROPOFF',
  COLLECT_TIME: 'COLLECT_TIME',
  CONFIRM: 'CONFIRM',
  DISPATCH: 'DISPATCH',
  BOOK: 'BOOK',
  FAQ_ANSWER: 'FAQ_ANSWER',
  OFFER_MORE: 'OFFER_MORE',
  ESCALATE: 'ESCALATE',
  GOODBYE: 'GOODBYE',
};

export const INTENTS = {
  BOOKING: 'booking',
  RIDE_NOW: 'ride_now',
  FAQ: 'faq',
};

// Keyword groups for zone matching (zone → pickup address keywords)
export const ZONE_KEYWORDS = {
  downtown: ['downtown', 'main st', 'main street', 'city hall', 'financial district'],
  airport: ['airport', 'terminal', 'arrivals', 'departures', 'lax', 'jfk', 'ord'],
  north: ['north', 'northside', 'uptown'],
  south: ['south', 'southside'],
  east: ['east', 'eastside'],
  west: ['west', 'westside'],
};

// Intent detection keywords
export const BOOKING_KEYWORDS = ['book', 'schedule', 'reserve', 'appointment', 'later', 'tomorrow', 'tonight'];
export const RIDE_NOW_KEYWORDS = ['now', 'right now', 'asap', 'immediately', 'urgent', 'pickup'];
export const FAQ_KEYWORDS = ['price', 'cost', 'how much', 'hours', 'open', 'available', 'where', 'what'];
