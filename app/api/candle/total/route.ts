import { NextResponse } from 'next/server';
import connectToDB from '@/lib/dbcConnect';
import CandleLog from '../../../../models/CandleLog';
import DonationLog from '../../../../models/DonationLog';
import Confession from '../../../../models/Confession';


export async function GET() {
  await connectToDB();

  const [candleAgg, donationAgg, totalConfessions, silentConfessions] = await Promise.all([
    CandleLog.aggregate([{ $group: { _id: null, count: { $sum: '$count' } } }]),
    DonationLog.aggregate([{ $group: { _id: null, count: { $sum: '$candleCount' } } }]),
    Confession.countDocuments(),
    Confession.countDocuments({ public: false }),
  ]);

  const candleCount = candleAgg[0]?.count || 0;
  const donationCount = donationAgg[0]?.count || 0;

  return NextResponse.json({
    totalCandles: candleCount + donationCount,
    totalDonations: donationCount,
    totalConfessions,
    silentConfessions,
  });
}
