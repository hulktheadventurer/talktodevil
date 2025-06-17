// app/api/delete/route.ts
import dbConnect from '@/lib/mongodb';
import Confession from '@/models/Confession';

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return new Response("Missing id", { status: 400 });

  await dbConnect();
  await Confession.findByIdAndDelete(id);

  return new Response("Deleted", { status: 200 });
}
