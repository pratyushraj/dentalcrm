import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://sqqocqujxlgoxbcnfbfb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = SUPABASE_SERVICE_ROLE_KEY ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) : null;

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

// Easycred Partner DSA Credentials
const EASYCRED_PARTNER_API = 'https://partner.easycred.co.in/api/partner/journey/initiate';
const EASYCRED_LOGIN_API = 'https://partner.easycred.co.in/api/partner/login-password';

const PARTNER_MOBILE = process.env.EASYCRED_MOBILE || '';
const PARTNER_PASSWORD = process.env.EASYCRED_PASSWORD || '';

let cachedToken = process.env.EASYCRED_PARTNER_TOKEN || '';
let tokenExpiry = 0;

async function getPartnerToken() {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && tokenExpiry > now + 60) {
    return cachedToken;
  }

  try {
    const loginRes = await axios.post(
      EASYCRED_LOGIN_API,
      { mobile: PARTNER_MOBILE, password: PARTNER_PASSWORD },
      { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, timeout: 7000 }
    );

    const cookies = loginRes.headers['set-cookie'] || [];
    let token = null;
    for (const c of cookies) {
      const match = c.match(/access_token=([^;]+)/);
      if (match) {
        token = match[1];
        break;
      }
    }

    if (token) {
      cachedToken = token;
      // Tokens are valid for 30 mins (1800s)
      tokenExpiry = now + 1700;
      return cachedToken;
    }
  } catch (err) {
    console.error('Failed to auto-refresh Easycred partner token:', err.message);
  }

  return cachedToken;
}

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const activeToken = await getPartnerToken();

  // Support GET for CRM lead status checking
  if (req.method === 'GET') {
    const { applicationId } = req.query || {};
    if (!applicationId) {
      return res.status(400).json({ success: false, error: 'applicationId required' });
    }
    try {
      const response = await axios.get(
        `https://partner.easycred.co.in/api/partner/leads/${encodeURIComponent(applicationId)}/status`,
        {
          headers: {
            'Authorization': `Bearer ${activeToken}`,
            'Cookie': `access_token=${activeToken}`,
            'Accept': 'application/json'
          },
          timeout: 7000
        }
      );
      return res.status(200).json({ success: true, data: response.data });
    } catch (err) {
      return res.status(200).json({ success: false, error: err.response?.data?.error || err.message });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { customerName, mobile, productCode = 'ONLINE_PERSONAL' } = req.body || {};

  if (!customerName || !mobile) {
    return res.status(400).json({ success: false, error: 'Customer name and 10-digit mobile are required' });
  }

  const cleanMobile = String(mobile).replace(/\D/g, '').slice(-10);
  if (cleanMobile.length !== 10) {
    return res.status(400).json({ success: false, error: 'Invalid 10-digit mobile number' });
  }

  // Capture client IP for compliance and audit trail
  const rawIp = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection?.remoteAddress || '';
  const clientIp = String(rawIp).split(',')[0].trim();
  console.log(`[Easycred Loan Apply] Initiating for ${customerName} (${cleanMobile}) from IP: ${clientIp || 'unknown'}`);

  try {
    const response = await axios.post(
      EASYCRED_PARTNER_API,
      {
        productCode,
        customerName: customerName.trim(),
        mobile: cleanMobile
      },
      {
        headers: {
          'Authorization': `Bearer ${activeToken}`,
          'Cookie': `access_token=${activeToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        timeout: 10000
      }
    );

    const inviteData = response.data?.data || {};
    const success = Boolean(response.data && response.data.success);
    const customerLink = inviteData.customerLink || `https://easycred.co.in/loan/apply?product=PERSONAL_LOAN&mobile=${cleanMobile}&name=${encodeURIComponent(customerName)}`;

    // 1. Permanently Save to Supabase (Zero Data Loss)
    try {
      if (supabase) {
        await supabase.from('audit_logs').insert([{
          action_type: 'EASYCRED_LOAN_APPLICATION',
          resource_type: 'loan_lead',
          resource_id: inviteData.inviteId || null,
          description: `Financing Application: ${customerName.trim()} (${cleanMobile})`,
        metadata: {
          applicant_name: customerName.trim(),
          mobile: cleanMobile,
          productCode,
          client_ip: clientIp,
          invite_id: inviteData.inviteId,
          customer_link: customerLink,
          status: success ? 'INITIATED' : 'FAILED',
          easycred_response: response.data
        },
        severity: 'info'
      }]);
      console.log(`[Easycred] Successfully stored lead for ${customerName} in Supabase.`);
    } catch (dbErr) {
      console.error('[Easycred] Failed to store lead in Supabase:', dbErr.message);
    }

    // 2. Send Real-time Email Alert to Admin
    try {
      if (RESEND_API_KEY) {
        await axios.post(
          'https://api.resend.com/emails',
          {
            from: 'Clinaza Leads <contact@clinaza.in>',
            to: ['funnyraj10@gmail.com'],
            subject: `🚨 [New Patient Loan Application] ${customerName.trim()} - ${cleanMobile}`,
            html: `
              <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 550px;">
                <h2 style="color: #0284c7; margin-top: 0;">⚡ New Patient Financing Application</h2>
                <p>A new applicant just submitted their details for point-of-care patient financing:</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Applicant Name:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${customerName.trim()}</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Mobile:</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="tel:+91${cleanMobile}">+91 ${cleanMobile}</a></td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">WhatsApp Link:</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="https://wa.me/91${cleanMobile}">Chat on WhatsApp</a></td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Product:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${productCode}</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">IP Address:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${clientIp || 'N/A'}</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Submitted At:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td></tr>
                </table>
                <p style="margin-top: 20px;"><a href="${customerLink}" style="background: #0284c7; color: #fff; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Open Application Link →</a></p>
              </div>
            `
          },
          {
            headers: {
              'Authorization': `Bearer ${RESEND_API_KEY}`,
              'Content-Type': 'application/json'
            },
            timeout: 5000
          }
        );
      }
    } catch (mailErr) {
      console.error('[Easycred] Failed to send email alert:', mailErr.message);
    }

    if (success) {
      return res.status(200).json({
        success: true,
        data: {
          inviteId: inviteData.inviteId,
          maskedMobile: inviteData.maskedMobile,
          customerLink: customerLink,
          smsSent: inviteData.smsSent
        }
      });
    } else {
      return res.status(200).json({
        success: false,
        error: response.data?.error || 'Could not initiate loan application with Easycred',
        fallbackLink: customerLink
      });
    }
  } catch (error) {
    console.error('Error proxying to Easycred:', error.response?.data || error.message);
    return res.status(200).json({
      success: false,
      error: error.response?.data?.error || error.message,
      fallbackLink: `https://easycred.co.in/loan/apply?product=PERSONAL_LOAN&mobile=${cleanMobile}&name=${encodeURIComponent(customerName)}`
    });
  }
}
