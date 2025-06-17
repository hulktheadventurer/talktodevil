// ✅ models/Blessing.ts
import mongoose from 'mongoose';

const BlessingSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // e.g. '2025-06-09'
  text: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Blessing || mongoose.model('Blessing', BlessingSchema);