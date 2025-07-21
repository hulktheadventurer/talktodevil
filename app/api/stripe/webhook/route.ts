import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import DonationLog from '@/models/DonationLog';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(req: NextRequest) {
  await dbConnect();

  const rawBody = await req.text();
  const signature = req.headers.get('stripe-signature') || '';

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed.');
    return new Response('Webhook Error', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const confessionId = session.metadata?.confessionId || '';
    const flameCount = parseInt(session.metadata?.flameCount || '0');
    const amount = Number(session.amount_total) / 100;

    await DonationLog.create({
      sessionId: session.id,
      amount,
      flameCount,
      source: 'stripe',
      confessionId,
    });

    console.log(`🔥 Logged ${flameCount} flames for confession ${confessionId}`);
  }

  return new Response('Received', { status: 200 });
}
