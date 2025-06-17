import { NextResponse } from 'next/server';
import connectToDB from '@/lib/dbcConnect';
import Confession from '@/models/Confession';

export async function GET() {
  await connectToDB();
  const confessions = await Confession.find({}).sort({ createdAt: -1 });
  return NextResponse.json(confessions);
}
