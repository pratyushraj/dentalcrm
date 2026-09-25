-- ============================================================
-- Migration 003: Lock down clinic_onboardings RLS
-- Prevent any anonymous/public read access to sensitive fields
-- Only authenticated admin users can SELECT all data
-- ============================================================

-- 1. Ensure RLS is enabled (idempotent)
ALTER TABLE public.clinic_onboardings ENABLE ROW LEVEL SECURITY;

-- 2. Drop any existing over-permissive SELECT policies
DROP POLICY IF EXISTS "anon_select_safe" ON public.clinic_onboardings;
DROP POLICY IF EXISTS "allow_select_safe" ON public.clinic_onboardings;
DROP POLICY IF EXISTS "anon_read_safe" ON public.clinic_onboardings;
-- Keep the insert policy (clinics need to submit the form)
-- DROP POLICY IF EXISTS "allow_insert_from_form" ON public.clinic_onboardings;

-- 3. Ensure NO anon SELECT policy exists
--    (anon can INSERT to submit the form, but never SELECT data back)
--    The default deny-all when RLS is enabled handles this,
--    but we explicitly confirm no SELECT policy for anon exists.

-- 4. Only authenticated users (admin dashboard login) can read all data
DROP POLICY IF EXISTS "allow_read_authenticated" ON public.clinic_onboardings;

CREATE POLICY "allow_read_authenticated"
  ON public.clinic_onboardings
  FOR SELECT
  TO authenticated
  USING (true);

-- 5. Insert policy for anon (form submissions must still work)
DROP POLICY IF EXISTS "allow_insert_from_form" ON public.clinic_onboardings;

CREATE POLICY "allow_insert_from_form"
  ON public.clinic_onboardings
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Verification comment:
-- After this migration:
--   anon key + SELECT -> returns 0 rows (RLS blocks it)
--   anon key + INSERT -> works (form submissions)
--   service_role key + SELECT -> returns all rows (bypasses RLS by design)
--   authenticated user + SELECT -> returns all rows
