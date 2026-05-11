import { getClient } from '../services/supabase.js';

/**
 * Atomically claim the best available driver for a given zone.
 * Uses FOR UPDATE SKIP LOCKED to prevent race conditions.
 */
export async function claimDriver(zone) {
  // Prefer same zone, then fall back to any available driver
  // Using a raw SQL approach via RPC for the atomic claim
  const { data, error } = await getClient().rpc('claim_driver', { p_zone: zone });
  if (error) throw error;
  return data ?? null; // returns driver row or null
}

export async function releaseDriver(driverId) {
  const { error } = await getClient()
    .from('drivers')
    .update({ is_available: true, last_dispatched_at: null })
    .eq('id', driverId);
  if (error) throw error;
}

export async function listDrivers() {
  const { data, error } = await getClient()
    .from('drivers')
    .select('*')
    .order('name');
  if (error) throw error;
  return data;
}

// Narrow select — safe to expose on the public driver card (no phone).
export async function getDriver(id) {
  const { data, error } = await getClient()
    .from('drivers')
    .select('id, name, zone, payment_url')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

// Full select for dashboard use only (includes phone, availability, etc.).
export async function listDriversFull() {
  const { data, error } = await getClient()
    .from('drivers')
    .select('id, name, zone, phone, is_available, payment_url, last_dispatched_at')
    .order('name');
  if (error) throw error;
  return data;
}
