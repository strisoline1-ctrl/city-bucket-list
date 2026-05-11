-- Revoke anon access to Supabase's internal RLS helper.
-- This function is SECURITY DEFINER (runs as superuser) and has no
-- legitimate public use — unauthenticated callers should never invoke it.
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon;
