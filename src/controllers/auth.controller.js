const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Wallet } = require('../models');
const { env } = require('../config/env');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
};

exports.register = async (req, res, next) => {
  try {
    const { fullName, email, password, phone, role } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or phone' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Default status pending for vendors and couriers
    const status = (role === 'vendor' || role === 'courier') ? 'pending' : 'active';

    const user = await User.create({
      fullName,
      email,
      passwordHash,
      phone,
      role: role || 'customer',
      status
    });

    // Create wallet for every new user
    await Wallet.create({ userId: user._id });

    const token = generateToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.status === 'disabled') {
      return res.status(403).json({ message: 'Account is disabled' });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.sendOTP = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60000); // 5 mins

    await User.findOneAndUpdate(
      { phone },
      { otp: { code, expiresAt } },
      { upsert: true }
    );

    // In production, send SMS here. For now, return in response.
    res.json({ message: 'OTP sent', code });
  } catch (err) {
    next(err);
  }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { phone, code } = req.body;
    const user = await User.findOne({ phone });

    if (!user || !user.otp || user.otp.code !== code || user.otp.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Clear OTP
    user.otp = undefined;
    if (user.status === 'pending' && user.role === 'customer') {
        user.status = 'active';
    }
    await user.save();

    const token = generateToken(user);
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
};
