import { api } from './api.js';

let loading;
const loadCheckout = () => {
  if (window.Razorpay) return Promise.resolve(true);
  if (loading) return loading;
  loading = new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => {
      loading = null;
      resolve(false);
    };
    document.body.appendChild(s);
  });
  return loading;
};

/**
 * Full subscription payment flow.
 *  1. POST /subscription/create-order
 *  2. Razorpay Checkout (or a simulated payment when the backend runs in
 *     ALLOW_TEST_PAYMENTS mode and returns an `order_test_*` id)
 *  3. POST /subscription/verify
 * Resolves with the verify response, rejects with Error('cancelled') when the
 * user closes the popup.
 */
export async function paySubscription(plan, user) {
  const created = await api.createSubscriptionOrder(plan._id);
  const { order, keyId } = created;

  // Backend test mode (no Razorpay keys configured)
  if (!keyId || String(order.id).startsWith('order_test_')) {
    return api.verifySubscription({
      razorpay_order_id: order.id,
      razorpay_payment_id: `pay_test_${Date.now()}`,
      razorpay_signature: 'test_signature',
    });
  }

  const ok = await loadCheckout();
  if (!ok) throw new Error('Could not load Razorpay checkout. Check your internet connection.');

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'ClassStream',
      description: `${order.planName} subscription`,
      order_id: order.id,
      prefill: { name: user?.name, email: user?.email },
      theme: { color: '#6852ED' },
      handler: async (resp) => {
        try {
          resolve(await api.verifySubscription(resp));
        } catch (e) {
          reject(e);
        }
      },
      modal: { ondismiss: () => reject(new Error('cancelled')) },
    });
    rzp.on('payment.failed', (r) => reject(new Error(r?.error?.description || 'Payment failed')));
    rzp.open();
  });
}
