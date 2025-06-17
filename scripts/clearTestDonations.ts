import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI!;
const DonationLog = mongoose.model('DonationLog', new mongoose.Schema({}, { strict: false }));

(async () => {
  await mongoose.connect(MONGODB_URI);
  const result = await DonationLog.deleteMany({ source: 'apply' }); // Optional: Add sessionId filter
  console.log(`Deleted ${result.deletedCount} test apply donation(s)`);
  process.exit(0);
})();
