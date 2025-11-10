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
}, { _id: false });

const UserSchema = new Schema({
  fullName: { type: String, required: true, index: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true },
  phone: String,
  role: { type: String, enum: ['customer','vendor','admin'], default: 'customer', index: true },
  status: { type: String, enum: ['active','disabled'], default: 'active', index: true },
  addresses: { type: [AddressSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
