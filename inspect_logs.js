import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLogs() {
  console.log("Fetching logs matching recipientPhone 9508243687...");
  const { data, error } = await supabase
    .from('reactivation_audit_logs')
    .select('*')
    .eq('patient_id', '9508243687')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log(`Found ${data.length} total logs matching patient_id 9508243687:`);
  data.forEach(log => {
    console.log("Time:", log.created_at);
    console.log("Action:", log.action);
    console.log("Details:", log.details);
    console.log("------------------------");
  });
}

checkLogs();
