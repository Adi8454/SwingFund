import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  value: { type: Number, required: true, min: 1, max: 45 },
  date: { type: Date, default: Date.now }
});

export const Score = mongoose.model('Score', scoreSchema);
