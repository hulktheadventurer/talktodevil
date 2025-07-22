import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import connectToDB from '@/lib/dbcConnect';
import DonationLog from '@/models/DonationLog';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  await connectToDB();

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
    console.error('⚠️ Stripe Webhook Error:', err);
    return new Response('Webhook signature verification failed.', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const confessionId = session.metadata?.confessionId || '';
    const amount = Number(session.amount_total) / 100;
    const flameCount = parseInt(session.metadata?.candleCount || '0');

    try {
      await DonationLog.create({
        sessionId: session.id,
        amount,
        flameCount, // still using field name 'flameCount'
        source: 'stripe',
        confessionId,
      });

      console.log(`🔥 Logged ${flameCount} flames for temptation ${confessionId}`);
    } catch (err) {
      console.error('⚠️ Failed to log flame offering:', err);
    }
  }

  return new Response('Webhook received', { status: 200 });
}
