import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(req: NextRequest) {
  try {
    const { amount, confessionId } = await req.json();

    // Validate amount
    if (!amount || isNaN(amount)) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Estimate flameCount for success page stats
    let flameCount = 0;
    if (amount === 0.99) flameCount = 1;
    else if (amount === 2.49) flameCount = 3;
    else if (amount === 3.99) flameCount = 5;
    else if (amount === 6.99) flameCount = 10;
    else flameCount = Math.max(1, Math.floor(amount / 0.99)); // fallback

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Flame Offering',
              description: `Flames for confession ${confessionId || 'general'}`,
            },
            unit_amount: Math.round(amount * 100), // pence
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/wall?success=1&flames=${flameCount}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/wall?canceled=1`,
      metadata: {
        confessionId: confessionId || '',
        flameCount: String(flameCount),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe error:', err?.message || err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
