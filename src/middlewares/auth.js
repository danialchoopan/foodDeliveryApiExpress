const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

module.exports.auth = (req, res, next) => {
  try {
    const hdr = req.headers.authorization || '';
    const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const payload = jwt.verify(token, env.jwtSecret);
    req.user = { id: payload.sub, role: payload.role || 'customer' };
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports.isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  next();
};

module.exports.isVendor = (req, res, next) => {
  if (req.user?.role !== 'vendor' && req.user?.role !== 'admin')
    return res.status(403).json({ message: 'Forbidden' });
  next();
};
