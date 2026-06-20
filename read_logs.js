import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://sqqocqujxlgoxbcnfbfb.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log("Fetching reactivation audit logs...");
  const { data: logs, error } = await supabase
    .from('reactivation_audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error("Error fetching logs:", error);
    return;
  }

  logs.forEach(l => {
    console.log(`- Time: ${l.created_at}, Action: ${l.action}`);
    console.log(`  Details:`, JSON.stringify(l.details, null, 2));
  });
}

run();
