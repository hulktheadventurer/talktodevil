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
    const replyEntry = thread.find((msg: any) =>
      ['father', 'devil', 'god', 'buddha'].includes(msg.role)
    );

    if (!messageEntry || !replyEntry) {
      return NextResponse.json({ error: 'Missing message or reply' }, { status: 400 });
    }

    console.log('🧾 Full thread:', thread);
    console.log('✅ Public:', isPublic);
    console.log('📩 Message Entry:', messageEntry);
    console.log('💬 Reply Entry:', replyEntry);

    try {
      const saved = await Confession.create({
        public: isPublic === true,
        thread,
        message: messageEntry.message,
        reply: replyEntry.message,
      });

      return NextResponse.json({ success: true, id: saved._id });
    } catch (err: any) {
      console.error('🔥 MongoDB insert error:', err.message || err);
      return NextResponse.json({ error: 'DB error: ' + err.message }, { status: 500 });
    }

  } catch (err: any) {
    console.error('Final save error:', err.message || err);
    return NextResponse.json({ error: 'Failed to save confession' }, { status: 500 });
  }
}
