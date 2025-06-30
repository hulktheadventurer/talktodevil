import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/dbcConnect';
import Confession from '@/models/Confession';
import { generateReply } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const { confession, public: isPublic } = await req.json();

    if (!confession || typeof confession !== 'string') {
      return NextResponse.json({ error: 'Missing confession text' }, { status: 400 });
    }

    const initialThread = [
      { role: 'user', message: confession },
    ];

    const reply = await generateReply(initialThread);

    initialThread.push({ role: 'father', message: reply });

    const saved = await Confession.create({
      public: isPublic !== false,
      thread: initialThread,
    });

    return NextResponse.json({ reply, id: saved._id, thread: saved.thread });
  } catch (err) {
    console.error('Confession error:', err);
    return NextResponse.json({ error: 'Failed to process confession' }, { status: 500 });
  }
}
