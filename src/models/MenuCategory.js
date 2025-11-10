const mongoose = require('mongoose');
const { Schema } = mongoose;
const { makeSlug } = require('../utils/slugify');

const MenuCategorySchema = new Schema({
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

MenuCategorySchema.index({ restaurantId: 1, slug: 1 }, { unique: true });

MenuCategorySchema.pre('validate', function(next) {
  if (!this.slug && this.name) this.slug = makeSlug(this.name);
  next();
});

module.exports = mongoose.model('MenuCategory', MenuCategorySchema);
