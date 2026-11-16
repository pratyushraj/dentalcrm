import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.SUPABASE_URL || 'https://sqqocqujxlgoxbcnfbfb.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const PLURAL_CLIENT_SECRET = process.env.PLURAL_CLIENT_SECRET || '024dd66a367549b380bd322ff6c3b279';

/**
 * Pine Labs / Plural Webhook Handler
 * Endpoint: /api/webhook/pinelabs
 * 
 * Handles real-time transaction lifecycle events:
 * - PAYMENT_SUCCESS / ORDER_PROCESSED
 * - PAYMENT_FAILED
 * - REFUND_PROCESSED
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Plural-Signature, X-Pine-Signature');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health-check / verification GET
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'active',
      gateway: 'pinelabs_plural',
      mid: process.env.PLURAL_MID || '111077',
      endpoint: '/api/webhook/pinelabs',
      timestamp: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const signature = req.headers['x-plural-signature'] || req.headers['x-pine-signature'] || req.headers['signature'];

    // If signature provided, verify HMAC SHA256 against Client Secret
    if (signature && PLURAL_CLIENT_SECRET) {
      const computed = crypto.createHmac('sha256', PLURAL_CLIENT_SECRET).update(rawBody).digest('hex');
      if (computed !== signature) {
        console.warn('[Pine Labs Webhook] Signature mismatch, proceeding with logging');
      }
    }

    const payload = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
    console.log('[Pine Labs Webhook Event Received]:', JSON.stringify(payload, null, 2));

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

    // If customer phone exists, log payment event into Supabase
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
        console.error('[Pine Labs Webhook DB Update Error]:', dbErr);
      }
    }

    // Always return 200 OK to acknowledge receipt to Pine Labs server
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
