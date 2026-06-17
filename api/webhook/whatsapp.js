import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client with Service Role Key for backend administration
const supabaseUrl = process.env.SUPABASE_URL || 'https://sqqocqujxlgoxbcnfbfb.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  // 1. Webhook Verification (Meta Verification GET request)
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // Verify Token configuration (custom secret string)
    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'shreeram_dental_waba_token';

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verified successfully.');
      return res.status(200).send(challenge);
    } else {
      console.warn('Webhook verification failed: Invalid verify token.');
      return res.status(403).json({ error: 'Verification failed' });
    }
  }

  // 2. Incoming Notification Events (Meta POST request)
  if (req.method === 'POST') {
    try {
      const payload = req.body;

      // Ensure we have a valid WhatsApp payload structure
      if (payload.object === 'whatsapp_business_account') {
        for (const entry of payload.entry || []) {
          for (const change of entry.changes || []) {
            const value = change.value;
            if (value && value.messages && value.messages.length > 0) {
              const phoneId = value.metadata?.phone_number_id;
              
              if (!phoneId) continue;

              // Query clinic based on WABA Phone Number ID
              const { data: clinic } = await supabase
                .from('dental_clinics')
                .select('id, name')
                .eq('whatsapp_phone_number_id', phoneId)
                .single();

              if (!clinic) {
                console.warn(`No clinic found matching whatsapp_phone_number_id: ${phoneId}`);
                continue;
              }

              for (const message of value.messages) {
                // Parse message details
                const fromPhone = message.from; // e.g. "917292984244"
                const contact = value.contacts?.find((c) => c.wa_id === fromPhone);
                const senderName = contact?.profile?.name || 'Patient';
                const bodyText = message.text?.body || '';
                const wamid = message.id;
                const timestampSec = message.timestamp;
                const timestampIso = timestampSec 
                  ? new Date(parseInt(timestampSec) * 1000).toISOString()
                  : new Date().toISOString();

                // Format patient phone standard (slice last 10 digits)
                const cleanPhoneKey = fromPhone.replace(/\D/g, '').slice(-10);

                console.log(`Saving inbound message from ${senderName} (${fromPhone}): "${bodyText}"`);

                // Insert into reactivation_audit_logs
                const { error: insertErr } = await supabase
                  .from('reactivation_audit_logs')
                  .insert({
                    organization_id: clinic.id,
                    action: 'waba_message',
                    patient_id: cleanPhoneKey,
                    created_at: timestampIso,
                    details: {
                      recipientName: senderName,
                      recipientPhone: fromPhone,
                      templateName: 'customer_incoming_reply',
                      body: bodyText,
                      status: 'replied',
                      type: 'service',
                      direction: 'inbound',
                      wamid: wamid,
                      variables: []
                    }
                  });

                if (insertErr) {
                  console.error('Error inserting webhook message into DB:', insertErr.message);
                }
              }
            }
          }
        }
      }

      return res.status(200).send('EVENT_RECEIVED');
    } catch (err) {
      console.error('Webhook error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  // Fallback for unsupported methods
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
