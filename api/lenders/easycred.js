import axios from 'axios';

// Easycred Partner DSA Credentials
const EASYCRED_PARTNER_API = 'https://partner.easycred.co.in/api/partner/journey/initiate';

// Fallback / active partner token (refreshed from partner session)
const PARTNER_TOKEN = process.env.EASYCRED_PARTNER_TOKEN || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTg1NTZlYmQwNmQxNjFkNTFhNzIxNzQiLCJyb2xlIjoiUEFSVE5FUiIsInBhcnRuZXJJZCI6IjZhODU1NmU5ZDA2ZDE2MWQ1MWE3MjE3MiIsInBlcm1pc3Npb25zIjpbXSwiaWF0IjoxNzg5ODA1NjkwLCJleHAiOjE3ODk4MTI4OTB9.BlJ8lk0EqZy-74kyjiACXewWfi1TtoalWXMCp1_Jl7w';

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
            'Authorization': `Bearer ${PARTNER_TOKEN}`,
            'Cookie': `access_token=${PARTNER_TOKEN}`,
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
          'Authorization': `Bearer ${PARTNER_TOKEN}`,
          'Cookie': `access_token=${PARTNER_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        timeout: 10000
      }
    );

    if (response.data && response.data.success) {
      return res.status(200).json({
        success: true,
        data: {
          inviteId: response.data.data.inviteId,
          maskedMobile: response.data.data.maskedMobile,
          customerLink: response.data.data.customerLink,
          smsSent: response.data.data.smsSent
        }
      });
    } else {
      return res.status(200).json({
        success: false,
        error: response.data?.error || 'Could not initiate loan application with Easycred',
        fallbackLink: `https://easycred.co.in/loan/apply?product=PERSONAL_LOAN&mobile=${cleanMobile}&name=${encodeURIComponent(customerName)}`
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
