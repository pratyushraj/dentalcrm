-- ============================================================
-- Clinaza: Add Website and Google Maps columns to clinic_onboardings
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

ALTER TABLE public.clinic_onboardings 
  ADD COLUMN IF NOT EXISTS website text,
  ADD COLUMN IF NOT EXISTS google_maps_url text;
