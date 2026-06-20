import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://sqqocqujxlgoxbcnfbfb.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  const clinicId = 'fd9f532d-10c2-4429-8b1b-e2694314f373';

  const { data: clinic } = await supabase
    .from('dental_clinics')
    .select('whatsapp_access_token')
    .eq('id', clinicId)
    .single();

  const wabaToken = clinic?.whatsapp_access_token;

  if (wabaToken) {
    // Query the WhatsApp Business Accounts for the system user
    const res = await fetch(`https://graph.facebook.com/v17.0/122095542117365791/whatsapp_business_accounts`, {
      headers: { 'Authorization': `Bearer ${wabaToken}` }
    });
    const accounts = await res.json();
    console.log("WABA Accounts list:", JSON.stringify(accounts, null, 2));

    if (accounts.data && accounts.data.length > 0) {
      const wabaId = accounts.data[0].id;
      console.log(`Found WABA ID: ${wabaId}. Querying templates...`);
      const templatesRes = await fetch(`https://graph.facebook.com/v17.0/${wabaId}/message_templates`, {
        headers: { 'Authorization': `Bearer ${wabaToken}` }
      });
      const templates = await templatesRes.json();
      console.log("Meta Templates list:");
      if (templates.data) {
        templates.data.forEach(t => {
          console.log(`- Name: ${t.name}, Status: ${t.status}, Category: ${t.category}`);
          t.components.forEach(c => {
            if (c.type === 'BODY') console.log(`  Body: ${c.text}`);
            if (c.type === 'HEADER') console.log(`  Header format: ${c.format}`);
          });
        });
      } else {
        console.log(JSON.stringify(templates, null, 2));
      }
    }
  }
}

run();
