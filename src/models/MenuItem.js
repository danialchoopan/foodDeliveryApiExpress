const mongoose = require('mongoose');
const { Schema } = mongoose;
const { makeSlug } = require('../utils/slugify');

const OptionChoiceSchema = new Schema({
  label: String,
  priceDiff: { type: Number, default: 0 }
}, { _id: false });

const OptionGroupSchema = new Schema({
  name: String,
  required: { type: Boolean, default: false },
  choices: { type: [OptionChoiceSchema], default: [] }
}, { _id: false });

const MenuItemSchema = new Schema({
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'MenuCategory', required: true, index: true },
  title: { type: String, required: true, index: true },
  slug: { type: String, required: true },
  description: String,
  price: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['active','archived','out_of_stock'], default: 'active', index: true },
  options: { type: [OptionGroupSchema], default: [] },
  images: { type: [String], default: [] },
}, { timestamps: true });

MenuItemSchema.index({ restaurantId: 1, slug: 1 }, { unique: true });

MenuItemSchema.pre('validate', function(next) {
  if (!this.slug && this.title) this.slug = makeSlug(this.title);
  next();
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);
