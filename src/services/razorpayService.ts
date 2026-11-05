declare global {
  interface Window {
    Razorpay?: any;
  }
}

export interface RazorpayCheckoutOptions {
  amount?: number; // In Rupees, e.g. 999
  name?: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  onSuccess?: (paymentResponse: {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }) => void;
  onDismiss?: () => void;
}

export const RAZORPAY_CONFIG = {
  keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TwQtTG8hU9dyVL',
  paymentHandle: 'https://razorpay.me/@clinaza',
  upiId: 'clinaza255876.rzp@rxairtel',
  qrAsset: '/assets/clinaza_activation_kit_qr.png',
  kitAmount: 999
};

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);

    if (window.Razorpay) {
      return resolve(true);
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('[Razorpay] Failed to load checkout.js, falling back to direct payment link');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export async function initiateRazorpayPayment(options: RazorpayCheckoutOptions = {}): Promise<void> {
  const amount = options.amount || RAZORPAY_CONFIG.kitAmount;

  try {
    const isLoaded = await loadRazorpayScript();

    if (!isLoaded || !window.Razorpay) {
      // Fallback: Open direct Razorpay payment handle
      window.open(RAZORPAY_CONFIG.paymentHandle, '_blank');
      return;
    }

    // Attempt to create an order from serverless backend
    let orderId: string | undefined;
    try {
      const res = await fetch('/api/payments?gateway=razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gateway: 'razorpay',
          amount,
          notes: options.notes || {}
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.orderId) {
          orderId = data.orderId;
        }
      }
    } catch (apiErr) {
      console.warn('[Razorpay] Server order creation fallback:', apiErr);
    }

    const rzpOptions: any = {
      key: RAZORPAY_CONFIG.keyId,
      amount: Math.round(amount * 100),
      currency: 'INR',
      name: options.name || 'CLINAZA',
      description: options.description || 'Clinic Activation Kit & Lifetime CRM Suite',
      image: '/assets/clinaza-logo.jpg',
      order_id: orderId,
      prefill: {
        name: options.prefill?.name || '',
        email: options.prefill?.email || '',
        contact: options.prefill?.contact || ''
      },
      notes: {
        brand: 'CLINAZA',
        product: 'Clinic Activation Kit',
        ...(options.notes || {})
      },
      theme: {
        color: '#0867E8'
      },
      modal: {
        ondismiss: () => {
          if (options.onDismiss) {
            options.onDismiss();
          }
        }
      },
      handler: (response: any) => {
        if (options.onSuccess) {
          options.onSuccess(response);
        }
      }
    };

    const rzpInstance = new window.Razorpay(rzpOptions);
    rzpInstance.open();
  } catch (err) {
    console.error('[Razorpay Checkout Error]', err);
    window.open(RAZORPAY_CONFIG.paymentHandle, '_blank');
  }
}
