// ✅ FIXED app/api/candle/donation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/dbcConnect';
import DonationLog from '@/models/DonationLog';
import Confession from '@/models/Confession';
import SiteState from '@/models/SiteState';

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const { confessionId, candles } = await req.json();

    if (!confessionId || typeof candles !== 'number' || candles <= 0) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Update confession if it's not a "blessing"
    if (confessionId !== 'blessing') {
      await Confession.findByIdAndUpdate(confessionId, {
        $inc: { donationCandleCount: candles },
      });
    }

    // Log donation
    await DonationLog.create({
      sessionId: 'guest',
      confessionId,
      candleCount: candles,
      source: 'donation',
    });

    // ✅ Fix: Ensure the update has a filter
    await SiteState.updateOne(
      {}, // <- important!
      {
        $inc: {
          donationCandles: candles,
          availableDonationCandles: candles,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Donation error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
