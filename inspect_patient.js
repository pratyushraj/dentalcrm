import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPatient() {
  const { data: list, error } = await supabase
    .from('dental_patients')
    .select('id, name, phone, prescription, estimates')
    .ilike('name', '%Gulshan%');
  
  if (error) {
    console.error("Error:", error);
    return;
  }

  list.forEach(p => {
    console.log("ID:", p.id);
    console.log("Name:", p.name);
    console.log("Phone:", p.phone);
    console.log("Prescription (length):", p.prescription ? p.prescription.length : 0);
    console.log("Prescription text:", p.prescription);
    console.log("Estimates:", p.estimates);
    console.log("------------------------");
  });
}

checkPatient();
