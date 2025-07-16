import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbcConnect';
import Confession from '@/models/Confession';
import { generateReply } from '@/lib/ai';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Missing message' }, { status: 400 });
    }

    const confession = await Confession.findById(params.id);
    if (!confession) {
      return NextResponse.json({ error: 'Confession not found' }, { status: 404 });
    }

    // Add user message
    confession.thread.push({
      role: 'user',
      message,
      timestamp: new Date(),
    });

    // Generate priest reply
    const reply = await generateReply(confession.thread);

    // Add priest message
    confession.thread.push({
      role: 'father',
      message: reply,
      timestamp: new Date(),
    });

    await confession.save();

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('Thread reply error:', err);
    return NextResponse.json(
      { error: 'Failed to reply to confession' },
      { status: 500 }
    );
  }
}
