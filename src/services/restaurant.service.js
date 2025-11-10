const { Restaurant } = require('../models');

exports.list = async (q = {}) => {
  const filter = {};
  if (q.search) filter.name = { $regex: q.search, $options: 'i' };
  return Restaurant.find(filter).sort({ createdAt: -1 });
};

exports.create = async (ownerId, data) => {
  return Restaurant.create({ ...data, owner: ownerId });
};

exports.update = async (id, ownerIdOrAdmin, data, isAdmin = false) => {
  const filter = isAdmin ? { _id: id } : { _id: id, owner: ownerIdOrAdmin };
  const doc = await Restaurant.findOne(filter);
  if (!doc) throw Object.assign(new Error('Restaurant not found'), { status: 404 });
  Object.assign(doc, data);
  await doc.save();
  return doc;
};
