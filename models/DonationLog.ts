import mongoose from 'mongoose';

const DonationLogSchema = new mongoose.Schema({
  sessionId: { type: String, required: true }, // anonymous session identifier or userId
  confessionId: { type: mongoose.Schema.Types.Mixed, required: true }, // Accepts ObjectId or string like 'blessing'
  flameCount: { type: Number, required: true }, // renamed from candleCount
  source: { type: String, enum: ['donation', 'apply'], default: 'donation' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.DonationLog || mongoose.model('DonationLog', DonationLogSchema);
