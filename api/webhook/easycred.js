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

      // If status is REJECTED or DECLINED, dispatch Option A email alert to admin
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
                  <div style="margin-top: 20px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 14px; font-size: 13px; color: #166534;">
                    💡 <strong>Recommended Recovery Action:</strong> Contact the patient and propose re-applying with an earning family co-applicant (spouse or parent) to secure instant approval.
                  </div>
                </div>
              `
            })
          });
          console.log('[Easycred Webhook] Rejection alert email dispatched to funnyraj10@gmail.com');
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
