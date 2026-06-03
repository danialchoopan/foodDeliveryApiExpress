const mongoose = require('mongoose');
const { Schema } = mongoose;

const TransactionSchema = new Schema({
  walletId: { type: Schema.Types.ObjectId, ref: 'Wallet', required: true, index: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['deposit', 'withdrawal', 'payment', 'refund', 'payout'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  description: String,
  referenceId: Schema.Types.ObjectId, // Link to Order or PayoutRequest
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
