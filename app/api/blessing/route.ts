
// ✅ app/api/blessing/route.ts
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
You are a divine and gentle voice. Compose a poetic blessing in under 50 words.
Speak with grace, hope, and calm. Address humanity with love.
Do not mention religion. Avoid repetition.
    `.trim();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: 'Please give today’s blessing.' },
      ],
    });

    const newBlessing = completion.choices[0].message.content?.trim() || 'You are loved.';
    const created = await Blessing.create({ date: today, text: newBlessing });

    return NextResponse.json({
      blessing: newBlessing,
      createdAt: created.createdAt,
    });
  } catch (error) {
    console.error('[API /blessing] Failed to load blessing:', error);
    return NextResponse.json(
      { error: 'Failed to load or generate blessing.' },
      { status: 500 }
    );
  }
}


