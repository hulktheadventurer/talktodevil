import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const password = searchParams.get('password');

  if (password === process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ success: true });
  } else {
    return new NextResponse('Unauthorized', { status: 401 });
  }
}
