import { getClient } from '../services/supabase.js';

export async function findByKeywords(query) {
  const words = query.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  if (!words.length) return null;

  // Match any FAQ whose keywords array overlaps with words from the query
  const { data, error } = await getClient()
    .from('faqs')
    .select('*')
    .eq('is_active', true)
    .overlaps('keywords', words)
    .limit(1)
    .single();

  if (error) return null;
  return data;
}
