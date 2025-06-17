import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbcConnect';
import Confession from '@/models/Confession';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();
  const { confessionId } = req.body;

  if (!confessionId) {
    return res.status(400).json({ error: 'Missing confession ID' });
  }

  const confession = await Confession.findById(confessionId);
  if (!confession) {
    return res.status(404).json({ error: 'Confession not found' });
  }

  confession.donationCount = (confession.donationCount || 0) + 1;
  await confession.save();

  res.status(200).json({ message: 'Donation recorded' });
}
