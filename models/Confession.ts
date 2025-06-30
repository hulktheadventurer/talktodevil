import mongoose from 'mongoose';

const ThreadMessageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'father'], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, { _id: false });

const ConfessionSchema = new mongoose.Schema({
  message: { type: String, required: true }, // legacy
  reply: { type: String, default: '' },       // legacy
  public: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },

  candleCount: { type: Number, default: 0 },
  donationCandleCount: { type: Number, default: 0 },

  thread: { type: [ThreadMessageSchema], default: [] },
});

// ✅ Optional: middleware to initialize `thread` from `message`/`reply` if not present
ConfessionSchema.pre('save', function (next) {
  if (!this.thread?.length && this.message) {
    this.thread = [
      { role: 'user', message: this.message, timestamp: this.createdAt || new Date() },
    ];
    if (this.reply) {
      this.thread.push({ role: 'father', message: this.reply, timestamp: new Date() });
    }
  }
  next();
});

export default mongoose.models.Confession || mongoose.model('Confession', ConfessionSchema);
