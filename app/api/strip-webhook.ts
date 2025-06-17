// pages/api/stripe-webhook.ts
import { buffer } from 'micro';
import Stripe from 'stripe';
import Donation from '@/models/DonationLog';
import dbConnect from '@/lib/dbcConnect';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sig = req.headers['stripe-signature'];
  const rawBody = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(400).send(`Webhook Error: ${message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    await dbConnect();

    if (!session.metadata) {
      throw new Error('Stripe session metadata is missing');
    }

    if (session.amount_total == null) {
      throw new Error('Stripe session amount_total is missing');
    }

    await Donation.create({
      sessionId: session.metadata.sessionId,
      amount: session.amount_total / 100,
      candleCount: parseInt(session.metadata.candleQuantity, 10),
    });
  }

  res.status(200).json({ received: true });
}
