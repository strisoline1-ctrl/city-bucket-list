import env from '../config/env.js';

const store = new Map();

function expireKey(callSid) {
  const ttl = env.SESSION_TTL_MINUTES * 60 * 1000;
  setTimeout(() => store.delete(callSid), ttl);
}

export const memoryStore = {
  async get(callSid) {
    return store.get(callSid) ?? null;
  },
  async set(callSid, session) {
    store.set(callSid, session);
    expireKey(callSid);
  },
  async end(callSid) {
    store.delete(callSid);
  },
};
