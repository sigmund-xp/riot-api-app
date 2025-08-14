const mongoose = require('mongoose')

const TournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USDT',
    enum: ['USDT', 'TEST_USDT']
  },
  category: {
    type: String,
    required: true,
    enum: ['digital', 'physical', 'service', 'bonus']
  },
  stock: {
    type: Number,
    default: -1 // -1 para productos ilimitados
  },
  isActive: {
    type: Boolean,
    default: true
  },
  imageUrl: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

TournamentSchema.index({ name: 'text', description: 'text' })
TournamentSchema.index({ category: 1, isActive: 1 })
TournamentSchema.index({ price: 1 })
TournamentSchema.index({ updatedAt: -1 })

TournamentSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model('Tournament', TournamentSchema, 'Torneos')
