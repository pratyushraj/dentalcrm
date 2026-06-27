import crypto from 'crypto';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (body && typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }

    const { path, payload, clientId, clientSecret, testId } = body || {};

    if (!path || !clientId || !clientSecret) {
      return res.status(400).json({ error: 'Missing path, clientId, or clientSecret' });
    }

    // Dynamic FAPI Headers required by Axis Bank API Gateway
    const uuid = crypto.randomUUID().replace(/[^a-zA-Z0-9]/g, '').slice(0, 30);
    const headers = {
      'Content-Type': 'application/json',
      'X-IBM-Client-Id': clientId,
      'X-IBM-Client-Secret': clientSecret,
      'x-fapi-channel-id': 'OPEN-API',
      'x-fapi-epoch-millis': Date.now().toString(),
      'x-fapi-uuid': uuid,
      'x-fapi-serviceId': 'OpenAPI',
      'x-fapi-serviceVersion': '1.0',
      'requestId': `REQ_${Date.now()}`,
      'X-AXIS-TEST-ID': testId || '3' // Default to 3 (Success/Approved) if not specified
    };

    const targetUrl = `https://apiportal.axis.bank.in/gateway/los/open-api/v3${path}`;
    
    console.log(`[Axis Gateway] Forwarding request to: ${targetUrl}`);

    const apiRes = await fetch(targetUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload || {})
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      console.error(`[Axis Gateway] Bank Error Status ${apiRes.status}:`, JSON.stringify(data));
      return res.status(200).json({ ok: false, error: data, status: apiRes.status });
    }

    return res.status(200).json({ ok: true, data });
  } catch (err) {
    console.error('[Axis Gateway] Exception:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
