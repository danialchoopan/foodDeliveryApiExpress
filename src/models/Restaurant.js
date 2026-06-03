const mongoose = require('mongoose');
const { Schema } = mongoose;
const slugify = require('slugify');

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
  category: { type: String, required: true, index: true }, // e.g., Pizza, FastFood, Iranian
  image: { type: String, default: '/assets/img/default-restaurant.jpg' },
  documents: {
    businessLicense: String,
    idCard: String
  },
  status: { type: String, enum: ['pending', 'active', 'suspended'], default: 'pending', index: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isOpen: { type: Boolean, default: true },
  openingHours: { type: [OpeningHoursSchema], default: [] },
  locations: { type: [LocationSchema], default: [] },
}, { timestamps: true });

RestaurantSchema.index({ 'locations.geo': '2dsphere' });

RestaurantSchema.pre('validate', function(next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
