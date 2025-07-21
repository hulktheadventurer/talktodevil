import mongoose, { Schema, model, models } from 'mongoose';

const ThreadSchema = new Schema(
  {
    message: String,
 role: {
  type: String,
  enum: ['user', 'father', 'devil', 'god', 'buddha'], // ✅ Add allowed roles here
},

    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ConfessionSchema = new Schema(
  {
    message: String,
    reply: String,
    createdAt: { type: Date, default: Date.now },
    public: { type: Boolean, default: true },
    candleCount: { type: Number, default: 0 },
    donationCandleCount: { type: Number, default: 0 },
    thread: [ThreadSchema],
  },
  { timestamps: true }
);

// Initialize thread if missing
ConfessionSchema.pre('save', function (next) {
  if (!this.thread?.length && this.message) {
(this as any).set('thread', [
  {
    role: 'user',
    message: this.message,
    timestamp: this.createdAt || new Date(),
  },
  ...(this.reply
    ? [{
        role: 'father',
        message: this.reply,
        timestamp: new Date(),
      }]
    : []),
]);

  }

  next();
});

const Confession = models.Confession || model('Confession', ConfessionSchema);
export default Confession;
