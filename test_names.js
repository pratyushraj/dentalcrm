import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://sqqocqujxlgoxbcnfbfb.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  const clinicId = 'fd9f532d-10c2-4429-8b1b-e2694314f373';
  const targetPhone = '917292984244';

  const { data: clinic } = await supabase
    .from('dental_clinics')
    .select('*')
    .eq('id', clinicId)
    .single();

  const wabaPhoneId = clinic.whatsapp_phone_number_id;
  const wabaToken = clinic.whatsapp_access_token;

  // Let's try sending 'smile_makeover' (in case the name is truncated)
  console.log("Attempting to send using template name 'smile_makeover'...");
  const payload1 = {
    messaging_product: "whatsapp",
    to: targetPhone,
    type: "template",
    template: {
      name: "smile_makeover",
      language: { code: "en" },
      components: [
        {
          "type": "header",
          "parameters": [
            { "type": "image", "image": { "link": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Placeholder_LCa.png" } }
          ]
        },
        {
          "type": "body",
          "parameters": [
            { "type": "text", "text": "Kumar" }
          ]
        }
      ]
    }
  };

  try {
    const response1 = await fetch(`https://graph.facebook.com/v17.0/${wabaPhoneId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${wabaToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload1)
    });
    console.log("smile_makeover response:", await response1.json());
  } catch (err) {
    console.error("Error for smile_makeover:", err);
  }

  // Let's also try sending 'smile_makeover_google_review'
  console.log("Attempting to send using template name 'smile_makeover_google_review'...");
  const payload2 = {
    messaging_product: "whatsapp",
    to: targetPhone,
    type: "template",
    template: {
      name: "smile_makeover_google_review",
      language: { code: "en" },
      components: [
        {
          "type": "header",
          "parameters": [
            { "type": "image", "image": { "link": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Placeholder_LCa.png" } }
          ]
        },
        {
          "type": "body",
          "parameters": [
            { "type": "text", "text": "Kumar" }
          ]
        }
      ]
    }
  };

  try {
    const response2 = await fetch(`https://graph.facebook.com/v17.0/${wabaPhoneId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${wabaToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload2)
    });
    console.log("smile_makeover_google_review response:", await response2.json());
  } catch (err) {
    console.error("Error for smile_makeover_google_review:", err);
  }
}

run();
