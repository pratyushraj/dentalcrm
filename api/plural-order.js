import { randomUUID } from 'crypto';

const PLURAL_ENV = process.env.PLURAL_ENV || 'staging';
const BASE_URL = PLURAL_ENV === 'production'
  ? 'https://api.pluralpay.in'
  : 'https://pluraluat.v2.pinepg.in';

const CLIENT_ID = process.env.PLURAL_CLIENT_ID || '31ace78b-4116-4a2c-9828-9b622042c2c7';
const CLIENT_SECRET = process.env.PLURAL_CLIENT_SECRET || 'dfa924c1a93b4ac18b8199c708325452';

let cachedToken = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt - 60000) {
    return cachedToken;
  }

  const payload = JSON.stringify({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'client_credentials'
  });

  const res = await fetch(`${BASE_URL}/api/auth/v1/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Request-ID': randomUUID(),
      'Request-Timestamp': new Date().toISOString()
    },
    body: payload
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to fetch Plural auth token (${res.status}): ${errText}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiresAt = new Date(data.expires_at).getTime();
  return cachedToken;
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const accessToken = await getAccessToken();

    // GET: Query order status
    if (req.method === 'GET') {
      const { orderId } = req.query || {};
      if (!orderId) {
        return res.status(400).json({ error: 'orderId query parameter is required' });
      }

      const orderRes = await fetch(`${BASE_URL}/api/pay/v1/orders/${encodeURIComponent(orderId)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Request-ID': randomUUID(),
          'Request-Timestamp': new Date().toISOString()
        }
      });

      const orderData = await orderRes.json();
      return res.status(orderRes.status).json(orderData);
    }

    // POST: Create new payment order
    if (req.method === 'POST') {
      const {
        amount = 999,
        currency = 'INR',
        merchantOrderReference,
        customer = {},
        callbackUrl = 'https://www.clinaza.in/onboarding/callback',
        failureCallbackUrl = 'https://www.clinaza.in/onboarding/failure'
      } = req.body || {};

      const orderRef = merchantOrderReference || `CLINAZA_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      const orderPayload = {
        merchant_order_reference: orderRef,
        order_amount: {
          value: Math.round(Number(amount) * 100), // value in paise
          currency: currency.toUpperCase()
        },
        customer: {
          customer_id: customer.id || `CUST_${Date.now()}`,
          first_name: customer.name || 'Dr. Clinic Partner',
          email_id: customer.email || 'contact@clinaza.in',
          mobile_number: customer.phone || '7292984244'
        },
        callback_url: callbackUrl,
        failure_callback_url: failureCallbackUrl
      };

      const orderRes = await fetch(`${BASE_URL}/api/pay/v1/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Request-ID': randomUUID(),
          'Request-Timestamp': new Date().toISOString()
        },
        body: JSON.stringify(orderPayload)
      });

      const orderData = await orderRes.json();
      return res.status(orderRes.status).json(orderData);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[Plural API Error]', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
}
