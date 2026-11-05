import Razorpay from 'razorpay';
import { randomUUID } from 'crypto';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TwQtTG8hU9dyVL';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'XfjlRy1Kq7XuCWy5f38LQZh3';

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET
});

// Plural config
const PLURAL_ENV = process.env.PLURAL_ENV || 'staging';
const PLURAL_BASE_URL = PLURAL_ENV === 'production'
  ? 'https://api.pluralpay.in'
  : 'https://pluraluat.v2.pinepg.in';
const PLURAL_CLIENT_ID = process.env.PLURAL_CLIENT_ID || '31ace78b-4116-4a2c-9828-9b622042c2c7';
const PLURAL_CLIENT_SECRET = process.env.PLURAL_CLIENT_SECRET || 'dfa924c1a93b4ac18b8199c708325452';

let cachedPluralToken = null;
let pluralTokenExpiresAt = 0;

async function getPluralAccessToken() {
  if (cachedPluralToken && Date.now() < pluralTokenExpiresAt - 60000) {
    return cachedPluralToken;
  }
  const payload = JSON.stringify({
    client_id: PLURAL_CLIENT_ID,
    client_secret: PLURAL_CLIENT_SECRET,
    grant_type: 'client_credentials'
  });
  const res = await fetch(`${PLURAL_BASE_URL}/api/auth/v1/token`, {
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
    throw new Error(`Plural auth failed (${res.status}): ${errText}`);
  }
  const data = await res.json();
  cachedPluralToken = data.access_token;
  pluralTokenExpiresAt = new Date(data.expires_at).getTime();
  return cachedPluralToken;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const gateway = (req.query?.gateway || req.body?.gateway || 'razorpay').toLowerCase();

  try {
    // ==========================================
    // 1. RAZORPAY (Primary Gateway)
    // ==========================================
    if (gateway === 'razorpay') {
      if (req.method === 'POST') {
        const {
          amount = 999,
          receipt = `rcpt_${Date.now()}`,
          notes = {}
        } = req.body || {};

        const amountInPaise = Math.round(Number(amount) * 100);

        const order = await razorpay.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt: String(receipt).slice(0, 40),
          notes: {
            brand: 'Clinaza',
            product: 'Clinic Activation Kit',
            ...notes
          }
        });

        return res.status(200).json({
          success: true,
          gateway: 'razorpay',
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: RAZORPAY_KEY_ID
        });
      }

      if (req.method === 'GET') {
        const { paymentId } = req.query || {};
        if (paymentId) {
          const payment = await razorpay.payments.fetch(paymentId);
          return res.status(200).json({ success: true, gateway: 'razorpay', payment });
        }
        return res.status(200).json({
          success: true,
          gateway: 'razorpay',
          keyId: RAZORPAY_KEY_ID,
          paymentHandle: 'https://razorpay.me/@clinaza',
          upiId: 'clinaza255876.rzp@rxairtel'
        });
      }
    }

    // ==========================================
    // 2. PLURAL / PINE LABS GATEWAY
    // ==========================================
    if (gateway === 'plural' || gateway === 'pinelabs') {
      const token = await getPluralAccessToken();

      if (req.method === 'GET') {
        const { orderId } = req.query || {};
        if (!orderId) {
          return res.status(400).json({ error: 'orderId is required' });
        }
        const orderRes = await fetch(`${PLURAL_BASE_URL}/api/pay/v1/orders/${encodeURIComponent(orderId)}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Request-ID': randomUUID(),
            'Request-Timestamp': new Date().toISOString()
          }
        });
        const orderData = await orderRes.json();
        return res.status(orderRes.status).json(orderData);
      }

      if (req.method === 'POST') {
        const {
          amount = 999,
          currency = 'INR',
          merchantOrderReference,
          customer = {},
          callbackUrl = 'https://www.clinaza.in/onboarding/callback',
          failureCallbackUrl = 'https://www.clinaza.in/onboarding/failure'
        } = req.body || {};

        const orderRef = merchantOrderReference || `CLINAZA_${Date.now()}`;
        const payload = {
          merchant_order_reference: orderRef,
          order_amount: {
            value: Math.round(Number(amount) * 100),
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

        const orderRes = await fetch(`${PLURAL_BASE_URL}/api/pay/v1/orders`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Request-ID': randomUUID(),
            'Request-Timestamp': new Date().toISOString()
          },
          body: JSON.stringify(payload)
        });
        const orderData = await orderRes.json();
        return res.status(orderRes.status).json(orderData);
      }
    }

    return res.status(400).json({ error: `Unknown payment gateway: ${gateway}` });
  } catch (err) {
    console.error('[Payments API Error]', err);
    return res.status(500).json({ error: 'Payment processing failed', message: err.message });
  }
}
