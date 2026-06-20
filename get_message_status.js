import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://sqqocqujxlgoxbcnfbfb.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  const clinicId = 'fd9f532d-10c2-4429-8b1b-e2694314f373';
  const messageId = 'wamid.HBgMOTE3MjkyOTg0MjQ0FQIAERgSOUM1ODcyRDcxRjU1REQwODQxAA==';

  const { data: clinic } = await supabase
    .from('dental_clinics')
    .select('whatsapp_access_token')
    .eq('id', clinicId)
    .single();

  const wabaToken = clinic?.whatsapp_access_token;

  if (wabaToken) {
    console.log(`Checking status for message ID: ${messageId}`);
    try {
      const res = await fetch(`https://graph.facebook.com/v17.0/${messageId}`, {
        headers: { 'Authorization': `Bearer ${wabaToken}` }
      });
      const data = await res.json();
      console.log("Message Status Details:", JSON.stringify(data, null, 2));
    } catch (err) {
      console.error("Error querying status:", err);
    }
  }
}

run();
