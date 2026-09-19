import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.SUPABASE_URL || 'https://sqqocqujxlgoxbcnfbfb.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const signature = req.headers['x-easycred-signature'];
    const webhookSecret = process.env.EASYCRED_WEBHOOK_SECRET || '';

    // If webhook secret configured, verify HMAC signature
    if (webhookSecret && signature) {
      const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      const computed = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
      if (computed !== signature) {
        console.warn('Invalid Easycred webhook signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    const event = req.body;
    console.log('[Easycred Webhook Event]:', event?.eventType, event?.data?.applicationId);

    // Event types: APPLICATION_STATUS_CHANGED, SANCTIONED, DISBURSED, REJECTED
    const { eventType, data } = event || {};
    const applicationId = data?.applicationId || data?.id;
    const mobile = data?.customerMobile || data?.mobile;
    const status = data?.status || eventType;
    const loanAmount = data?.sanctionedAmount || data?.amount;

    if (mobile) {
      const cleanMobile = String(mobile).replace(/\D/g, '').slice(-10);
      
      // Update patient's custom fields or notes if patient exists in Supabase
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
        console.warn('Database note update error:', dbErr.message);
      }
    }

    return res.status(200).json({ received: true, event: eventType });
  } catch (err) {
    console.error('Webhook processing failed:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
