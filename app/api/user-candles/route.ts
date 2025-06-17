// ✅ FIXED app/api/user-candles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SiteState from '@/models/SiteState';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const state = await SiteState.findOne();

    return NextResponse.json({
      donationCandles: state?.donationCandles || 0,
      availableDonationCandles: state?.availableDonationCandles || 0, // ✅ Add this
    });
  } catch (err) {
    console.error('[API /user-candles] Error:', err);
    return NextResponse.json({
      donationCandles: 0,
      availableDonationCandles: 0,
    });
  }
}
