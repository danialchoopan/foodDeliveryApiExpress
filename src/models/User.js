const mongoose = require('mongoose');
const { Schema } = mongoose;

const AddressSchema = new Schema({
  label: String,
  line1: { type: String, required: true },
  line2: String,
  city: String,
  province: String,
  postalCode: String,
  country: { type: String, default: 'IR' },
  geo: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [51.3890, 35.6892] } // [lng, lat]
  }
}, { _id: false });

const UserSchema = new Schema({
  fullName: { type: String, required: true, index: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true },
  phone: { type: String, required: true, unique: true, index: true },
  role: { type: String, enum: ['customer','vendor','courier','admin'], default: 'customer', index: true },
  status: { type: String, enum: ['pending','active','disabled'], default: 'active', index: true },
  otp: {
    code: String,
    expiresAt: Date
  },
  addresses: { type: [AddressSchema], default: [] },
}, { timestamps: true });

UserSchema.index({ 'addresses.geo': '2dsphere' });

module.exports = mongoose.model('User', UserSchema);
