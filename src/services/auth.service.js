const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { User } = require('../models');

exports.register = async ({ fullName, email, password }) => {
  const exists = await User.findOne({ email });
  if (exists) throw Object.assign(new Error('Email already registered'), { status: 409 });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ fullName, email, passwordHash, role: 'customer' });
  return { id: user._id, fullName: user.fullName, email: user.email, role: user.role };
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  const token = jwt.sign({ sub: String(user._id), role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  return { token };
};

exports.me = async (userId) => {
  const u = await User.findById(userId).select('fullName email role status createdAt');
  return u;
};
