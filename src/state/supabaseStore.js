import { getClient } from '../services/supabase.js';
import env from '../config/env.js';

export const supabaseStore = {
  async get(callSid) {
    const { data, error } = await getClient()
      .from('call_sessions')
      .select('*')
      .eq('call_sid', callSid)
      .gt('expires_at', new Date().toISOString())
      .single();
    if (error || !data) return null;
    return {
      callSid: data.call_sid,
      callerPhone: data.caller_phone,
      state: data.state,
      attempts: data.attempts,
      data: data.data,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async set(callSid, session) {
    const expiresAt = new Date(Date.now() + env.SESSION_TTL_MINUTES * 60 * 1000).toISOString();
    await getClient().from('call_sessions').upsert({
      call_sid: callSid,
      caller_phone: session.callerPhone,
      state: session.state,
      attempts: session.attempts,
      data: session.data,
      updated_at: new Date().toISOString(),
      expires_at: expiresAt,
    }, { onConflict: 'call_sid' });
  },

  async end(callSid) {
    await getClient().from('call_sessions').delete().eq('call_sid', callSid);
  },
};
