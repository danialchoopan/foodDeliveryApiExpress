const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', index: true },
  courierId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },

  restaurantRating: { type: Number, min: 1, max: 5 },
  restaurantComment: String,

  courierRating: { type: Number, min: 1, max: 5 },
  courierComment: String,

  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' }
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);
