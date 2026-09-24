-- ============================================================
-- Clinaza: Clinic Onboardings Table
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS clinic_onboardings (
  id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_name         text        NOT NULL,
  doctor_name         text,
  city                text        NOT NULL,
  phone               text        NOT NULL,
  email               text,
  chairs              text,
  specialties         text[],
  avg_monthly_cases   text,
  expected_emi_loans  text,
  avg_ticket_size     text,
  has_current_account text,
  business_proof_type text,
  has_cancelled_cheque text,
  utm_source          text,
  utm_medium          text,
  utm_campaign        text,
  source              text        DEFAULT 'clinic-onboarding-portal',
  created_at          timestamptz DEFAULT now()
);

-- Index for fast lookup by city and source
CREATE INDEX IF NOT EXISTS idx_clinic_onboardings_city       ON clinic_onboardings (city);
CREATE INDEX IF NOT EXISTS idx_clinic_onboardings_utm_source ON clinic_onboardings (utm_source);
CREATE INDEX IF NOT EXISTS idx_clinic_onboardings_created_at ON clinic_onboardings (created_at DESC);

-- Allow public (anon) INSERT only — no SELECT for anon (admin reads via service role or admin page)
ALTER TABLE clinic_onboardings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_insert_from_form"
  ON clinic_onboardings
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users (your admin login) to read all rows
CREATE POLICY "allow_read_authenticated"
  ON clinic_onboardings
  FOR SELECT
  TO authenticated
  USING (true);
