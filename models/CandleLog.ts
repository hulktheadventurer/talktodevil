// ✅ models/CandleLog.ts
import mongoose from 'mongoose';

const CandleLogSchema = new mongoose.Schema({
  confessionId: {
    type: mongoose.Schema.Types.Mixed, // ✅ Accepts ObjectId or 'blessing'
    required: true,
  },
  count: {
    type: Number,
    default: 1,
  },
  litAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.CandleLog || mongoose.model('CandleLog', CandleLogSchema);
