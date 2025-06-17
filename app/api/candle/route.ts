import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CandleLog from '@/models/CandleLog';
import Confession from '@/models/Confession';

export async function POST(req: NextRequest) {
  await dbConnect();

  const { confessionId, count = 1 } = await req.json();
  if (!confessionId) {
    return NextResponse.json({ error: 'Missing confessionId' }, { status: 400 });
  }

  // ✅ Save light log for all types including 'blessing'
  await CandleLog.create({
    confessionId,
    count,
    litAt: new Date(),
  });

  // ✅ Only update Confession collection if it's not 'blessing'
  if (confessionId !== 'blessing') {
    try {
      await Confession.findByIdAndUpdate(
        confessionId,
        { $inc: { candleCount: count } },
        { new: true }
      );
    } catch (err) {
      console.error('Failed to update confession candle count:', err);
    }
  }

  return NextResponse.json({ success: true }); // ✅ Always return valid JSON
}
