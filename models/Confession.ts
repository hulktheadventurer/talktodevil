import mongoose from 'mongoose';

const ConfessionSchema = new mongoose.Schema({
  message: { type: String, required: true },
  reply: { type: String, default: '' },
  public: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },

  // ✅ Ensure these exist for count tracking
  candleCount: { type: Number, default: 0 },
  donationCandleCount: { type: Number, default: 0 },
});

export default mongoose.models.Confession || mongoose.model('Confession', ConfessionSchema);
