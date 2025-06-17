// app/api/public-confessions/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Confession from '@/models/Confession';

export async function GET() {
  await dbConnect();
  const data = await Confession.find({ public: true }).sort({ createdAt: -1 });
  return NextResponse.json(data);
}
