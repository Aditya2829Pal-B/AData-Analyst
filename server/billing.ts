import express from 'express';
import Stripe from 'stripe';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (getApps().length === 0) {
  initializeApp();
}

const router = express.Router();

let stripeClient: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is missing');
    stripeClient = new Stripe(key, { apiVersion: '2025-01-27.acacia' });
  }
  return stripeClient;
}

router.post('/create-checkout-session', express.json(), async (req, res) => {
  try {
    const { userId, email } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const stripe = getStripe();
    // In MVP, we can hardcode a price ID or use an inline price. For an MVP, creating an inline price is easiest if we don't know the exact product IDs beforehand, but it's better to use price_data.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      client_reference_id: userId,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Pro Data Analyst Subscription',
              description: 'Unlock unlimited data analysis and advanced features.',
            },
            unit_amount: 1500, // $15.00 / month
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin}?checkout=success`,
      cancel_url: `${req.headers.origin}?checkout=canceled`,
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: error.message });
  }
});

// For webhooks, we need the raw body
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!sig || !webhookSecret) {
    return res.status(400).send('Webhook Secret or Signature missing');
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;
      if (userId) {
        await getFirestore().collection('users').doc(userId).set({
          subscriptionTier: 'pro',
          stripeCustomerId: session.customer,
        }, { merge: true });
        console.log(`User ${userId} upgraded to PRO`);
      }
    } else if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      const customer = subscription.customer;
      
      const snapshot = await getFirestore().collection('users').where('stripeCustomerId', '==', customer).get();
      if (!snapshot.empty) {
        snapshot.forEach(async (doc) => {
          await doc.ref.set({ subscriptionTier: 'free' }, { merge: true });
        });
      }
    }
    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook event:', error);
    res.status(500).send('Webhook handler error');
  }
});

export default router;
