import { NextResponse } from 'next/server';
import connectToDB from '@/lib/dbcConnect';
import Confession from '@/models/Confession';

export async function GET() {
  try {
    await connectToDB();
    const confessions = await Confession.find({ public: true })
      .sort({ createdAt: -1 });

    return NextResponse.json({ confessions }); // ✅ Must wrap in object!
  } catch (err) {
    console.error('Error loading public confessions:', err);
    return NextResponse.json({ error: 'Failed to load confessions' }, { status: 500 });
  }
}
