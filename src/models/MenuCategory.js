const mongoose = require('mongoose');
const { Schema } = mongoose;

const MenuCategorySchema = new Schema({
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
  title: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('MenuCategory', MenuCategorySchema);
