import Razorpay from 'razorpay';

const KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TwQtTG8hU9dyVL';
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'XfjlRy1Kq7XuCWy5f38LQZh3';

const razorpay = new Razorpay({
  key_id: KEY_ID,
  key_secret: KEY_SECRET
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
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
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: KEY_ID
      });
    }

    if (req.method === 'GET') {
      const { paymentId } = req.query || {};
      if (paymentId) {
        const payment = await razorpay.payments.fetch(paymentId);
        return res.status(200).json({ success: true, payment });
      }
      return res.status(200).json({
        success: true,
        keyId: KEY_ID,
        paymentHandle: 'https://razorpay.me/@clinaza',
        upiId: 'clinaza255876.rzp@rxairtel'
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[Razorpay Order Error]', error);
    return res.status(500).json({
      error: 'Failed to process Razorpay order',
      message: error.message
    });
  }
}
