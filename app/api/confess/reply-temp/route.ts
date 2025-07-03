import { NextRequest, NextResponse } from 'next/server';
import { generateReply } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const { thread } = await req.json();

    if (!Array.isArray(thread) || thread.length === 0) {
      return NextResponse.json({ error: 'Missing or invalid thread' }, { status: 400 });
    }

    const reply = await generateReply(thread);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error('Temp reply error:', err);
    return NextResponse.json({ error: 'Failed to generate reply' }, { status: 500 });
  }
}
