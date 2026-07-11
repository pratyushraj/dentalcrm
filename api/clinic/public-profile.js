import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://sqqocqujxlgoxbcnfbfb.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { clinic_id } = req.query;
  if (!clinic_id) return res.status(400).json({ error: 'clinic_id is required' });

  try {
    const { data, error } = await supabase
      .from('dental_clinics')
      .select('id, name, phone, doctor_name, google_review_url')
      .eq('id', clinic_id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Clinic not found' });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('public-profile error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
