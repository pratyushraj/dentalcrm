const fetch = require('node-fetch');

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, phone, city, treatment, budget, emiNeeded, notes, pageSource } = req.body || {};

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone number are required' });
    }

    const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);
    const whatsappLink = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Hi ${name}, I am following up on your inquiry for ${treatment || 'dental treatment'} through Clinaza.`)}`;

    const RESEND_API_KEY = process.env.RESEND_API_KEY || Buffer.from('cmVfN01ZTnl1V3RfUUZMU3dqcmZhaEEyMVV1Q3pIRXdEdXJw', 'base64').toString('utf-8');
    const NOTIFICATION_EMAIL = 'funnyraj10@gmail.com';

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; background: #f8fafc; padding: 20px; }
    .card { max-width: 540px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 28px 24px; }
    .badge { display: inline-block; background: #dbeafe; color: #1e40af; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; margin-bottom: 12px; }
    h2 { margin-top: 0; color: #0f172a; font-size: 20px; }
    .lead-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .lead-label { font-weight: 600; color: #64748b; }
    .lead-value { font-weight: 700; color: #0f172a; }
    .btn-wa { display: inline-block; background: #25D366; color: #ffffff !important; text-decoration: none; font-weight: bold; font-size: 14px; padding: 12px 20px; border-radius: 8px; margin-top: 20px; }
    .btn-call { display: inline-block; background: #0867E8; color: #ffffff !important; text-decoration: none; font-weight: bold; font-size: 14px; padding: 12px 20px; border-radius: 8px; margin-top: 20px; margin-left: 8px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">🚨 NEW PATIENT INQUIRY</div>
    <h2>New Dental Treatment Lead Received!</h2>
    <p style="font-size: 14px; color: #475569; margin-bottom: 20px;">A new patient just requested clinic connection & treatment pricing from <strong>${pageSource || 'Clinaza Blog'}</strong>.</p>
    
    <div class="lead-row">
      <span class="lead-label">Patient Name:</span>
      <span class="lead-value">${name}</span>
    </div>
    <div class="lead-row">
      <span class="lead-label">Phone / WhatsApp:</span>
      <span class="lead-value">+91 ${cleanPhone}</span>
    </div>
    <div class="lead-row">
      <span class="lead-label">City / Location:</span>
      <span class="lead-value">${city || 'Not Specified'}</span>
    </div>
    <div class="lead-row">
      <span class="lead-label">Treatment Needed:</span>
      <span class="lead-value" style="color: #0867E8;">${treatment || 'Dental Implants'}</span>
    </div>
    <div class="lead-row">
      <span class="lead-label">Monthly EMI Needed?</span>
      <span class="lead-value">${emiNeeded ? 'Yes (Requested Financing)' : 'Self-Pay / Exploring Options'}</span>
    </div>
    ${budget ? `<div class="lead-row"><span class="lead-label">Target Budget:</span><span class="lead-value">${budget}</span></div>` : ''}
    ${notes ? `<div class="lead-row"><span class="lead-label">Patient Notes:</span><span class="lead-value">${notes}</span></div>` : ''}
    <div class="lead-row">
      <span class="lead-label">Timestamp:</span>
      <span class="lead-value">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</span>
    </div>

    <div style="margin-top: 24px; text-align: center;">
      <a href="${whatsappLink}" class="btn-wa">💬 Open WhatsApp Chat</a>
      <a href="tel:+91${cleanPhone}" class="btn-call">📞 Call Patient</a>
    </div>
  </div>
</body>
</html>`;

    // Send via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
      },
      body: JSON.stringify({
        from: 'Clinaza Patient Leads <contact@clinaza.in>',
        to: [NOTIFICATION_EMAIL],
        subject: `🚨 [New Patient Lead] ${name} - ${treatment || 'Dental Care'} (${city || 'India'})`,
        html: htmlContent
      })
    });

    const resendResult = await resendResponse.json();

    return res.status(200).json({
      success: true,
      message: 'Inquiry received successfully',
      id: resendResult.id
    });
  } catch (err) {
    console.error('Error handling patient lead:', err);
    return res.status(500).json({ error: 'Failed to process lead inquiry', details: err.message });
  }
};
