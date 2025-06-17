import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CandleLog from '@/models/CandleLog';
import DonationLog from '@/models/DonationLog';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const blessingCandleAgg = await CandleLog.aggregate([
      { $match: { confessionId: 'blessing' } },
      { $group: { _id: null, total: { $sum: '$count' } } },
    ]);

    const blessingDonationAgg = await DonationLog.aggregate([
      { $match: { confessionId: 'blessing' } },
      { $group: { _id: null, total: { $sum: '$candleCount' } } },
    ]);

    return NextResponse.json({
      blessingCandleCount: blessingCandleAgg[0]?.total || 0,
      blessingDonationCount: blessingDonationAgg[0]?.total || 0,
    });
  } catch (err) {
    console.error('[API /blessing/counts] Error:', err);
    return NextResponse.json({
      blessingCandleCount: 0,
      blessingDonationCount: 0,
    });
  }
}
