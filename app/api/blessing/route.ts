// ✅ app/api/blessing/route.ts — renamed for TalkToDevil's temptation

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
        temptation: existing.text,
        createdAt: existing.createdAt,
      });
    }

    const prompt = `
You are the Devil. Write a daily temptation — something seductive, ironic, dark, or morally ambiguous — in under 50 words.
It should sound charming, clever, or dangerous. Address the reader directly. It can be playful, poetic, or unnervingly honest.
Avoid religious references or anything hateful or graphic.
Return only the quote — no preamble, no explanation.
    `.trim();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: 'Give today’s temptation.' },
      ],
    });

    const newTemptation =
      completion.choices[0].message.content?.trim() ||
      'The sweetest lies are the ones you tell yourself.';

    const created = await Blessing.create({ date: today, text: newTemptation });

    return NextResponse.json({
      temptation: newTemptation,
      createdAt: created.createdAt,
    });
  } catch (error) {
    console.error('[API /blessing] Failed to generate temptation:', error);
    return NextResponse.json(
      { error: 'Failed to generate today’s temptation.' },
      { status: 500 }
    );
  }
}
