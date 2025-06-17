// models/SiteState.ts
import mongoose from 'mongoose';

const SiteStateSchema = new mongoose.Schema({
  availableDonationCandles: { type: Number, default: 0 },
  donationCandles: { type: Number, default: 0 },
});

export default mongoose.models.SiteState || mongoose.model('SiteState', SiteStateSchema);
