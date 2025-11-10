const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderItemSchema = new Schema({
  itemId: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  titleSnapshot: String,
  priceSnapshot: { type: Number, required: true, min: 0 },
  quantity: { type: Number, default: 1, min: 1 },
  selectedOptions: [{ group: String, choice: String, priceDiff: Number }]
}, { _id: false });

const StatusHistorySchema = new Schema({
  status: { 
    type: String, 
    enum: ['pending','accepted','preparing','ready','out_for_delivery','delivered','canceled','refunded'], 
    required: true 
  },
  by: { type: Schema.Types.ObjectId, ref: 'User' },
  at: { type: Date, default: Date.now }
}, { _id: false });

const OrderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
  items: { type: [OrderItemSchema], default: [] },
  pricing: {
    subtotal: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    discountTotal: { type: Number, default: 0 },
    total: { type: Number, required: true, min: 0 }
  },
  delivery: {
    type: { type: String, enum: ['delivery','pickup'], default: 'delivery' },
    addressSnapshot: {},
    geo: { type: { type: String, enum: ['Point'] }, coordinates: [Number] }
  },
  payment: { 
    status: { type: String, enum: ['unpaid','paid','refunded'], default: 'unpaid' }, 
    provider: String, 
    ref: String 
  },
  status: { 
    type: String, 
    enum: ['pending','accepted','preparing','ready','out_for_delivery','delivered','canceled','refunded'], 
    default: 'pending', 
    index: true 
  },
  statusHistory: { type: [StatusHistorySchema], default: [] },
  placedAt: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

OrderSchema.index({ restaurantId: 1, placedAt: -1 });

module.exports = mongoose.model('Order', OrderSchema);
