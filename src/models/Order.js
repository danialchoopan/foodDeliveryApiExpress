const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderItemSchema = new Schema({
  itemId: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  titleSnapshot: String,
  priceSnapshot: { type: Number, required: true, min: 0 },
  quantity: { type: Number, default: 1, min: 1 },
}, { _id: false });

const StatusHistorySchema = new Schema({
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'preparing', 'ready', 'searching_courier', 'courier_assigned', 'picked_up', 'delivered', 'canceled'],
    required: true 
  },
  by: { type: Schema.Types.ObjectId, ref: 'User' },
  at: { type: Date, default: Date.now }
}, { _id: false });

const OrderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
  courierId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  items: { type: [OrderItemSchema], default: [] },
  pricing: {
    subtotal: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    discountTotal: { type: Number, default: 0 },
    total: { type: Number, required: true, min: 0 }
  },
  delivery: {
    address: String,
    geo: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }
    }
  },
  payment: { 
    status: { type: String, enum: ['unpaid','paid','refunded'], default: 'unpaid' }, 
    method: { type: String, enum: ['online', 'wallet', 'cod'], default: 'online' },
    transactionId: String
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'preparing', 'ready', 'searching_courier', 'courier_assigned', 'picked_up', 'delivered', 'canceled'],
    default: 'pending', 
    index: true 
  },
  statusHistory: { type: [StatusHistorySchema], default: [] },
  placedAt: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

OrderSchema.index({ restaurantId: 1, placedAt: -1 });
OrderSchema.index({ courierId: 1, status: 1 });

module.exports = mongoose.model('Order', OrderSchema);
