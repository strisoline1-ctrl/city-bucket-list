-- Fix mutable search_path on functions (Supabase security advisory)
-- Without this, a malicious schema early in the caller's search_path could
-- shadow public tables/functions and cause the function to execute against
-- the wrong object.

alter function public.tg_set_updated_at() set search_path = public;
alter function public.claim_driver(text)  set search_path = public;
