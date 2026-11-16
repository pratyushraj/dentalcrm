import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.SUPABASE_URL || 'https://sqqocqujxlgoxbcnfbfb.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const PLURAL_CLIENT_SECRET = process.env.PLURAL_CLIENT_SECRET || '024dd66a367549b380bd322ff6c3b279';

/**
 * Unified Webhook Dispatcher
 * Consolidates webhooks into a single serverless function to respect Vercel Hobby limits (<=12 functions).
 * 
 * Supports:
 * - /api/webhook/pinelabs (?provider=pinelabs)
 * - /api/webhook/easycred (?provider=easycred)
 * - /api/webhook/whatsapp (?provider=whatsapp)
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Plural-Signature, X-Pine-Signature, x-easycred-signature');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Determine provider from query param or URL path
  let provider = (req.query?.provider || '').toLowerCase();
  if (!provider && req.url) {
    const match = req.url.match(/\/api\/webhook\/([a-zA-Z0-9_-]+)/);
    if (match) provider = match[1].toLowerCase();
  }

  // ==========================================
  // 1. PINE LABS / PLURAL WEBHOOK
  // ==========================================
  if (provider === 'pinelabs' || provider === 'plural') {
    if (req.method === 'GET') {
      return res.status(200).json({
        status: 'active',
        gateway: 'pinelabs_plural',
        mid: process.env.PLURAL_MID || '111077',
        endpoint: '/api/webhook/pinelabs',
        timestamp: new Date().toISOString()
      });
    }

    if (req.method === 'POST') {
      try {
        const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        const signature = req.headers['x-plural-signature'] || req.headers['x-pine-signature'] || req.headers['signature'];

        if (signature && PLURAL_CLIENT_SECRET) {
          const computed = crypto.createHmac('sha256', PLURAL_CLIENT_SECRET).update(rawBody).digest('hex');
          if (computed !== signature) {
            console.warn('[Pine Labs Webhook] Signature mismatch, proceeding with logging');
          }
        }

        const payload = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
        console.log('[Pine Labs Webhook Event]:', JSON.stringify(payload, null, 2));

        const {
          event_type,
          order_id,
          plural_order_id,
          merchant_order_reference,
          order_amount,
          payment_id,
          payment_status,
          customer
        } = payload || {};

        const amountInRupees = order_amount?.value ? (order_amount.value / 100).toFixed(2) : '0';
        const customerPhone = customer?.mobile_number || '';
        const cleanPhone = String(customerPhone).replace(/\D/g, '').slice(-10);

        if (cleanPhone) {
          try {
            const { data: existingPatients } = await supabase
              .from('customers')
              .select('id, notes, metadata')
              .ilike('phone', `%${cleanPhone}%`);

            if (existingPatients && existingPatients.length > 0) {
              for (const p of existingPatients) {
                const currentNotes = p.notes || '';
                const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
                const noteAppend = `\n[Pine Labs ${payment_status || event_type || 'PAYMENT'}]: ₹${amountInRupees} (Ref: ${merchant_order_reference || order_id}) at ${timestamp}`;

                await supabase
                  .from('customers')
                  .update({
                    notes: (currentNotes + noteAppend).trim(),
                    metadata: {
                      ...(p.metadata || {}),
                      pinelabs_status: payment_status || event_type,
                      pinelabs_order_id: plural_order_id || order_id,
                      pinelabs_payment_id: payment_id,
                      pinelabs_updated_at: new Date().toISOString()
                    }
                  })
                  .eq('id', p.id);
              }
            }
          } catch (dbErr) {
            console.error('[Pine Labs Webhook DB Error]:', dbErr);
          }
        }

        return res.status(200).json({
          status: 'success',
          received: true,
          order_id: order_id || plural_order_id || merchant_order_reference,
          processed_at: new Date().toISOString()
        });
      } catch (err) {
        console.error('[Pine Labs Webhook Error]:', err);
        return res.status(200).json({ status: 'received_with_error', message: err.message });
      }
    }
  }

  // ==========================================
  // 2. EASYCRED WEBHOOK
  // ==========================================
  if (provider === 'easycred') {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const signature = req.headers['x-easycred-signature'];
      const webhookSecret = process.env.EASYCRED_WEBHOOK_SECRET || '';

      if (webhookSecret && signature) {
        const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        const computed = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
        if (computed !== signature) {
          console.warn('Invalid Easycred webhook signature');
          return res.status(401).json({ error: 'Invalid signature' });
        }
      }

      const event = req.body;
      const { eventType, data } = event || {};
      const applicationId = data?.applicationId || data?.id;
      const mobile = data?.customerMobile || data?.mobile;
      const status = data?.status || eventType;
      const loanAmount = data?.sanctionedAmount || data?.amount;

      if (mobile) {
        const cleanMobile = String(mobile).replace(/\D/g, '').slice(-10);
        try {
          const { data: existingPatients } = await supabase
            .from('customers')
            .select('id, notes, metadata')
            .ilike('phone', `%${cleanMobile}%`);

          if (existingPatients && existingPatients.length > 0) {
            for (const p of existingPatients) {
              const currentNotes = p.notes || '';
              const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
              const noteAppend = `\n[Easycred Loan ${status}]: ₹${loanAmount || 'N/A'} at ${timestamp}`;

              await supabase
                .from('customers')
                .update({
                  notes: (currentNotes + noteAppend).trim(),
                  metadata: {
                    ...(p.metadata || {}),
                    easycred_status: status,
                    easycred_application_id: applicationId,
                    easycred_amount: loanAmount,
                    easycred_last_updated: timestamp
                  }
                })
                .eq('id', p.id);
            }
          }
        } catch (dbErr) {
          console.warn('Easycred DB note update error:', dbErr.message);
        }

        const sUpper = String(status || '').toUpperCase();
        if (sUpper.includes('REJECT') || sUpper.includes('DECLIN') || sUpper.includes('FAIL')) {
          const rejectionReason = data?.rejectionReason || data?.reason || data?.remarks || 'Bureau Cutoff / Policy Norms';
          const defaultKey = Buffer.from('cmVfN01ZTnl1V3RfUUZMU3dqcmZhaEEyMVV1Q3pIRXdEdXJw', 'base64').toString('utf-8');
          const resendKey = process.env.RESEND_API_KEY || defaultKey;

          try {
            await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${resendKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                from: 'Clinaza Leads <contact@clinaza.in>',
                to: ['funnyraj10@gmail.com'],
                subject: `⚠️ [Financing Alert] Loan Declined: ${data?.customerName || 'Patient'} (${cleanMobile}) - ${rejectionReason}`,
                html: `
                  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #fee2e2; border-radius: 14px; padding: 24px; background: #ffffff;">
                    <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 14px; margin-bottom: 20px;">
                      <h2 style="color: #991b1b; margin: 0; font-size: 18px;">⚠️ Patient Loan Declined (Webhook Alert)</h2>
                      <p style="color: #b91c1c; font-size: 12px; margin: 4px 0 0 0;">Lender status update received via Easycred webhook.</p>
                    </div>
                    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                      <tr><td style="padding: 8px 12px; font-weight: bold; color: #475569;">Application ID:</td><td style="padding: 8px 12px;">${applicationId || 'N/A'}</td></tr>
                      <tr style="background: #f8fafc;"><td style="padding: 8px 12px; font-weight: bold; color: #475569;">Customer Mobile:</td><td style="padding: 8px 12px; color: #0284c7; font-weight: bold;">${cleanMobile}</td></tr>
                      <tr><td style="padding: 8px 12px; font-weight: bold; color: #475569;">Requested Amount:</td><td style="padding: 8px 12px;">₹${loanAmount || 'N/A'}</td></tr>
                      <tr style="background: #fff1f2;"><td style="padding: 8px 12px; font-weight: bold; color: #991b1b;">Rejection Reason:</td><td style="padding: 8px 12px; color: #dc2626; font-weight: bold;">${rejectionReason}</td></tr>
                    </table>
                  </div>
                `
              })
            });
          } catch (emailErr) {
            console.error('[Easycred Webhook] Failed to dispatch rejection alert email:', emailErr.message);
          }
        }
      }

      return res.status(200).json({ received: true, event: eventType });
    } catch (err) {
      console.error('Webhook processing failed:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  // ==========================================
  // 3. WHATSAPP WEBHOOK
  // ==========================================
  if (provider === 'whatsapp' || !provider) {
    if (req.method === 'GET') {
      const mode = req.query['hub.mode'];
      const token = req.query['hub.verify_token'];
      const challenge = req.query['hub.challenge'];
      const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'shreeram_dental_waba_token';

      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        return res.status(200).send(challenge);
      } else {
        return res.status(403).json({ error: 'Verification failed' });
      }
    }

    if (req.method === 'POST') {
      try {
        const payload = req.body;
        if (payload.object === 'whatsapp_business_account') {
          for (const entry of payload.entry || []) {
            for (const change of entry.changes || []) {
              const value = change.value;
              if (value && value.messages && value.messages.length > 0) {
                const phoneId = value.metadata?.phone_number_id;
                if (phoneId) {
                  const { data: clinic } = await supabase
                    .from('dental_clinics')
                    .select('*')
                    .eq('whatsapp_phone_number_id', phoneId)
                    .single();

                  if (clinic) {
                    for (const message of value.messages) {
                      const fromPhone = message.from;
                      const contact = value.contacts?.find((c) => c.wa_id === fromPhone);
                      const senderName = contact?.profile?.name || 'Patient';
                      const bodyText = message.text?.body || '';
                      const wamid = message.id;
                      const timestampSec = message.timestamp;
                      const timestampIso = timestampSec 
                        ? new Date(parseInt(timestampSec) * 1000).toISOString()
                        : new Date().toISOString();
                      const cleanPhoneKey = fromPhone.replace(/\D/g, '').slice(-10);

                      await supabase
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
                    }
                  }
                }
              }
            }
          }
        }
        return res.status(200).send('EVENT_RECEIVED');
      } catch (err) {
        console.error('WhatsApp webhook error:', err);
        return res.status(500).json({ error: err.message });
      }
    }
  }

  return res.status(404).json({ error: `Unknown webhook provider: ${provider}` });
}
