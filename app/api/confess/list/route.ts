// app/api/confess/list/route.ts
import { NextResponse } from 'next/server';
import connectToDB from '@/lib/dbcConnect';
import Confession from '@/models/Confession';

export async function GET() {
  await connectToDB();

  const confessions = await Confession.find({ public: true })
    .sort({ createdAt: -1 })
    .limit(50);

  return NextResponse.json(confessions);
}
