import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('dental_clinics')
    .update({ medications: [] })
    .eq('id', 'fd9f532d-10c2-4429-8b1b-e2694314f373');
    
  if (error) {
    console.error("Error updating medications:", error.message);
  } else {
    console.log("Success! Columns exist in dental_clinics.");
  }
}
run();
