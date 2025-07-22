import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(req: NextRequest) {
  try {
    const { amount, confessionId } = await req.json();

    if (!amount || isNaN(amount)) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Estimate lotusCount for stats
    let lotusCount = 0;
    if (amount === 0.99) lotusCount = 1;
    else if (amount === 2.49) lotusCount = 3;
    else if (amount === 3.99) lotusCount = 5;
    else if (amount === 6.99) lotusCount = 10;
    else lotusCount = Math.max(1, Math.floor(amount / 0.99));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Lotus Offering',
              description: `Lotuses for reflection ${confessionId || 'general'}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/wall?success=1&lotuses=${lotusCount}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/wall?canceled=1`,
      metadata: {
        confessionId: confessionId || '',
        lotusCount: String(lotusCount),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe error:', err?.message || err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
