const mongoose = require('mongoose');
const { Schema } = mongoose;
const { makeSlug } = require('../utils/slugify');

const OpeningHoursSchema = new Schema({
  day: { type: Number, min: 0, max: 6 }, // 0=Sun
  open: String, // "09:00"
  close: String // "22:00"
}, { _id: false });

const LocationSchema = new Schema({
  label: String,
  geo: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [51.3890, 35.6892] } // [lng, lat]
  },
  address: String,
  phone: String
}, { _id: false });

const RestaurantSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: String,
  tags: { type: [String], default: [] },
  isOpen: { type: Boolean, default: true },
  openingHours: { type: [OpeningHoursSchema], default: [] },
  locations: { type: [LocationSchema], default: [] },
}, { timestamps: true });

RestaurantSchema.index({ 'locations.geo': '2dsphere' });

RestaurantSchema.pre('validate', function(next) {
  if (!this.slug && this.name) this.slug = makeSlug(this.name);
  next();
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
