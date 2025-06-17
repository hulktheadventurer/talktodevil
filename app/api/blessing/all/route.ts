import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Blessing from '@/models/Blessing';

export async function GET() {
  await dbConnect();

  try {
    const blessings = await Blessing.find().sort({ date: -1 });
    return NextResponse.json({ blessings });
  } catch (err) {
    console.error('Error fetching blessings:', err);
    return NextResponse.json({ blessings: [] });
  }
}
