// Uses Node 18+ built-in fetch – no node-fetch dependency needed

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') { res.setHeader('Allow', ['POST']); return res.status(405).end(); }

  try {
    let body = req.body;
    if (body && typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }

    const { wabaPhoneId, wabaToken, payload } = body || {};
    if (!wabaPhoneId || !wabaToken || !payload) {
      return res.status(400).json({ error: 'Missing wabaPhoneId, wabaToken, or payload' });
    }

    const metaRes = await fetch(`https://graph.facebook.com/v20.0/${wabaPhoneId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${wabaToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const metaData = await metaRes.json();
    if (!metaRes.ok) {
      console.error('Meta API Error:', JSON.stringify(metaData));
      return res.status(metaRes.status).json(metaData);
    }

    return res.status(200).json(metaData);
  } catch (err) {
    console.error('send-message crash:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
