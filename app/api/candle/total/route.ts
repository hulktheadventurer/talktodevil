import { NextResponse } from 'next/server';
import connectToDB from '@/lib/dbcConnect';
import CandleLog from '@/models/CandleLog';
import DonationLog from '@/models/DonationLog';
import Confession from '@/models/Confession';

export async function GET() {
  await connectToDB();

  const totalCandles = await CandleLog.aggregate([{ $group: { _id: null, count: { $sum: '$count' } } }]);
  const totalDonations = await DonationLog.aggregate([{ $group: { _id: null, count: { $sum: '$candleCount' } } }]);
  const totalConfessions = await Confession.countDocuments();
  const silentConfessions = await Confession.countDocuments({ public: false });

  return NextResponse.json({
    totalCandles: totalCandles[0]?.count || 0,
    totalDonations: totalDonations[0]?.count || 0,
    totalConfessions,
    silentConfessions,
  });
}
