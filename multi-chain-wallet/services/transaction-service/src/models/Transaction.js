import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  chain: {
    type: String,
    required: true,
    index: true
  },
  hash: {
    type: String,
    required: true,
    unique: true
  },
  from: {
    type: String,
    required: true,
    index: true
  },
  to: {
    type: String,
    required: true,
    index: true
  },
  value: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed'],
    default: 'pending'
  },
  confirmations: {
    type: Number,
    default: 0
  },
  blockNumber: Number,
  blockHash: String,
  gasUsed: String,
  gasPrice: String,
  fee: String,
  nonce: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export const Transaction = mongoose.model('Transaction', transactionSchema);