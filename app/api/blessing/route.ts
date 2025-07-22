// ✅ app/api/blessing/route.ts — rewritten for TalkToBuddha

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Blessing from '@/models/Blessing';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const today = new Date().toISOString().slice(0, 10);
    let existing = await Blessing.findOne({ date: today });

    if (existing) {
      return NextResponse.json({
        blessing: existing.text,
        createdAt: existing.createdAt,
      });
    }

    const prompt = `
You are the Buddha. Write a peaceful and wise daily reflection under 50 words.
It should be calm, meditative, and rooted in timeless truth. Speak in a soothing tone. Avoid religious dogma.
You may use poetic language or metaphor. End with a full stop.
Return only the reflection — no preamble, no explanation.
    `.trim();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: 'Share today’s reflection.' },
      ],
    });

    const newReflection =
      completion.choices[0].message.content?.trim() ||
      'Peace arises when we stop chasing what cannot be caught.';

    const created = await Blessing.create({ date: today, text: newReflection });

    return NextResponse.json({
      blessing: newReflection,
      createdAt: created.createdAt,
    });
  } catch (error) {
    console.error('[API /blessing] Failed to generate blessing:', error);
    return NextResponse.json(
      { error: 'Failed to generate today’s reflection.' },
      { status: 500 }
    );
  }
}
