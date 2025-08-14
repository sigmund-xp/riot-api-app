import mongoose from 'mongoose'

const BalanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  availableBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  lockedBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  totalDeposited: {
    type: Number,
    default: 0
  },
  totalWithdrawn: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'USDT',
    enum: ['USDT', 'TEST_USDT']
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

BalanceSchema.index({ updatedAt: -1 })

BalanceSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

export const Balance = mongoose.model('Balance', BalanceSchema, 'Saldos')
