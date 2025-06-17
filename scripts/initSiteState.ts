import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error('Missing MONGODB_URI in .env');

const SiteStateSchema = new mongoose.Schema({
  availableDonationCandles: { type: Number, default: 0 },
  donationCandles: { type: Number, default: 0 },
});

const SiteState = mongoose.models.SiteState || mongoose.model('SiteState', SiteStateSchema);

async function init() {
  await mongoose.connect(MONGODB_URI);

  const existing = await SiteState.findOne();
  if (!existing) {
    await SiteState.create({
      availableDonationCandles: 0,
      donationCandles: 0,
    });
    console.log('✅ SiteState created');
  } else {
    console.log('⚠️ SiteState already exists');
  }

  await mongoose.disconnect();
}

init().catch(err => {
  console.error(err);
  process.exit(1);
});
