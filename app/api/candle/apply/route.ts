// ✅ FIXED app/api/candle/apply/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import DonationLog from '@/models/DonationLog';
import SiteState from '@/models/SiteState';

export async function POST(req: NextRequest) {
  await dbConnect();

  const { confessionId } = await req.json();
  if (!confessionId) {
    return NextResponse.json({ error: 'Missing confessionId' }, { status: 400 });
  }

  const sessionId = 'guest';
  const candleCount = 1;

  const siteState = await SiteState.findOne();

  // ✅ Use availableDonationCandles here
  if (!siteState || siteState.availableDonationCandles < 1) {
    return NextResponse.json({ error: 'No donation candles available' }, { status: 400 });
  }

  // ✅ Decrement availableDonationCandles instead
  await SiteState.updateOne({}, { $inc: { availableDonationCandles: -1 } });

  await DonationLog.create({
    confessionId,
    sessionId,
    candleCount,
    source: 'apply',
  });

  return NextResponse.json({ success: true });
}
