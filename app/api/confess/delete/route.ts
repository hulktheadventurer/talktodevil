import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Confession from '@/models/Confession';

export async function POST(req: NextRequest) {
  const { id, password } = await req.json();
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  await Confession.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
