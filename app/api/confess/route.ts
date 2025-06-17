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

    const reply = await generateReply(confession);

    const saved = await Confession.create({
      message: confession,
      reply,
      public: isPublic !== false,
    });

    return NextResponse.json({ reply, id: saved._id });
  } catch (err) {
    console.error('Confession error:', err);
    return NextResponse.json({ error: 'Failed to process confession' }, { status: 500 });
  }
}
