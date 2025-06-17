// /app/api/debug/clear-user-candles/route.ts
import { NextResponse } from 'next/server';
import connectToDB from '@/lib/dbcConnect';
import DonationLog from '@/models/DonationLog';

import { NextRequest } from 'next/server';

export async function DELETE(req: NextRequest) {

  await connectToDB();
  const sessionId = req.headers.get('cookie')?.match(/session_id=([^;]+)/)?.[1];
  if (!sessionId) return NextResponse.json({ error: 'No session ID' }, { status: 400 });

  await DonationLog.deleteMany({ sessionId });
  return NextResponse.json({ message: 'Session donation candles cleared' });
}
