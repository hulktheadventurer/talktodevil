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

    const messageEntry = thread.find((msg: any) => msg.role === 'user');
    const replyEntry = thread.find((msg: any) => msg.role === 'father');

    if (!messageEntry || !replyEntry) {
      return NextResponse.json({ error: 'Missing message or reply' }, { status: 400 });
    }

    const saved = await Confession.create({
      public: isPublic === true, // ✅ explicitly true
      thread,
      message: messageEntry.message,
      reply: replyEntry.message,
    });

    return NextResponse.json({ success: true, id: saved._id });
  } catch (err: any) {
    console.error('Final save error:', err.message || err);
    return NextResponse.json({ error: 'Failed to save confession' }, { status: 500 });
  }
}
