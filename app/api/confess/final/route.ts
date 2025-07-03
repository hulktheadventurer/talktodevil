import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/dbcConnect';
import Confession from '@/models/Confession';

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const { thread, public: isPublic } = await req.json();

    if (!Array.isArray(thread) || thread.length === 0) {
      return NextResponse.json({ error: 'Missing or invalid thread' }, { status: 400 });
    }

    const saved = await Confession.create({
      public: isPublic !== false,
      thread,
    });

    return NextResponse.json({ success: true, id: saved._id });
  } catch (err) {
    console.error('Final save error:', err);
    return NextResponse.json({ error: 'Failed to save confession' }, { status: 500 });
  }
}
