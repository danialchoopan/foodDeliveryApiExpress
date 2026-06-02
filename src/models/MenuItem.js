const mongoose = require('mongoose');
const { Schema } = mongoose;

const MenuItemSchema = new Schema({
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'MenuCategory', required: true, index: true },
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true, min: 0 },
  image: String,
  isAvailable: { type: Boolean, default: true },
  discount: {
    percentage: { type: Number, default: 0 },
    expiresAt: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', MenuItemSchema);
