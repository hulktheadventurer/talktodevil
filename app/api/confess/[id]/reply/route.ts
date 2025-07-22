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
      return NextResponse.json({ error: 'Temptation not found' }, { status: 404 });
    }

    // Log user's sinful whisper
    confession.thread.push({
      role: 'user',
      message,
      timestamp: new Date(),
    });

    // The Devil responds...
    const reply = await generateReply(confession.thread);

    // Add Devil's message
    confession.thread.push({
      role: 'devil',
      message: reply,
      timestamp: new Date(),
    });

    await confession.save();

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('Temptation reply error:', err);
    return NextResponse.json(
      { error: 'Failed to process the Devil\'s reply' },
      { status: 500 }
    );
  }
}
