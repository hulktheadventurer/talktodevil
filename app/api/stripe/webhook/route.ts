import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import DonationLog from '@/models/DonationLog';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
apiVersion: '2025-05-28.basil',
});

export async function POST(req: NextRequest) {
  await dbConnect(); // ✅ Fixed here

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
    const amount = Number(session.amount_total) / 100;

    let candleCount = 0;
    if (amount === 1) candleCount = 3;
    else if (amount === 3) candleCount = 10;
    else if (amount === 5) candleCount = 20;

    await DonationLog.create({
      sessionId: session.id,
      amount,
      candleCount,
      source: 'stripe',
      confessionId,
    });
  }

  return new Response('Received', { status: 200 });
}
