const mongoose = require('mongoose');
const { Schema } = mongoose;

const CouponSchema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true, index: true },
  description: String,
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  maxDiscount: { type: Number }, // For percentage coupons
  minOrderValue: { type: Number, default: 0 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  usageLimit: { type: Number },
  usedCount: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  scope: { type: String, enum: ['global', 'restaurant'], default: 'global' },
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant' }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', CouponSchema);
