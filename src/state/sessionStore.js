import env from '../config/env.js';
import { memoryStore } from './memoryStore.js';
// supabaseStore imported lazily to avoid requiring Supabase credentials in dev

let _store = null;

async function getStore() {
  if (_store) return _store;
  if (env.SESSION_STORE === 'supabase') {
    const { supabaseStore } = await import('./supabaseStore.js');
    _store = supabaseStore;
  } else {
    _store = memoryStore;
  }
  return _store;
}

export async function getSession(callSid) {
  const store = await getStore();
  return store.get(callSid);
}

export async function setSession(callSid, session) {
  const store = await getStore();
  return store.set(callSid, { ...session, updatedAt: new Date().toISOString() });
}

export async function endSession(callSid) {
  const store = await getStore();
  return store.end(callSid);
}

export function createSession(callSid, callerPhone) {
  return {
    callSid,
    callerPhone,
    state: 'GREETING',
    attempts: 0,
    data: {
      name: null,
      intent: null,
      pickup: null,
      dropoff: null,
      scheduledAt: null,
      isImmediate: false,
      faqQuery: null,
      bookingId: null,
      driverId: null,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
