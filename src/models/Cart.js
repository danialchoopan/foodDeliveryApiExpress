const mongoose = require('mongoose');
const { Schema } = mongoose;

const CartItemSchema = new Schema({
  itemId: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  titleSnapshot: String,
  priceSnapshot: { type: Number, required: true, min: 0 },
  quantity: { type: Number, default: 1, min: 1 },
  selectedOptions: [{ group: String, choice: String, priceDiff: Number }]
}, { _id: false });

const CartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
  items: { type: [CartItemSchema], default: [] },
  status: { type: String, enum: ['active','converted','abandoned'], default: 'active', index: true },
}, { timestamps: true });

CartSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Cart', CartSchema);
