const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['deposit', 'withdrawal', 'purchase', 'reward', 'transfer']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USDT',
    enum: ['USDT', 'TEST_USDT']
  },
  status: {
    type: String,
    default: 'completed',
    enum: ['pending', 'completed', 'failed', 'cancelled']
  },
  description: {
    type: String
  },
  referenceId: {
    type: String,
    required: true,
    unique: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

TransactionSchema.index({ userId: 1 })
TransactionSchema.index({ referenceId: 1 }, { unique: true })
TransactionSchema.index({ createdAt: -1 })
TransactionSchema.index({ type: 1, status: 1 })

module.exports = mongoose.model('Transaction', TransactionSchema, 'Transacciones')
