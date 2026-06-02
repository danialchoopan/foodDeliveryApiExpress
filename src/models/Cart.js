const mongoose = require('mongoose');
const { Schema } = mongoose;

const CartItemSchema = new Schema({
  itemId: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  quantity: { type: Number, default: 1, min: 1 },
}, { _id: false });

const CartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  items: { type: [CartItemSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);
