-- ============================================================
-- Clinaza: Add Premises & Google Reviews columns to clinic_onboardings
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

ALTER TABLE public.clinic_onboardings 
  ADD COLUMN IF NOT EXISTS premises_type text,
  ADD COLUMN IF NOT EXISTS google_rating text,
  ADD COLUMN IF NOT EXISTS review_count text;
