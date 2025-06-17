import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export default async function dbConnect() {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI is missing from environment variables');
    throw new Error('Missing MONGODB_URI');
  }

  console.log('🔌 Connecting to MongoDB URI:', uri.split('@')[1]);

  const db = await mongoose.connect(uri); // Remove deprecated options
  isConnected = db.connections[0].readyState === 1;
}
