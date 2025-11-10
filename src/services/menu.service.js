const { MenuCategory, MenuItem } = require('../models');

exports.listCategories = (restaurantId) =>
  MenuCategory.find({ restaurantId }).sort({ sortOrder: 1 });

exports.createCategory = (restaurantId, payload) =>
  MenuCategory.create({ restaurantId, ...payload });

exports.updateCategory = async (id, payload) => {
  const doc = await MenuCategory.findById(id);
  if (!doc) throw Object.assign(new Error('Category not found'), { status: 404 });
  Object.assign(doc, payload);
  await doc.save();
  return doc;
};

exports.listItems = (restaurantId, q = {}) => {
  const filter = { restaurantId };
  if (q.categoryId) filter.categoryId = q.categoryId;
  if (q.status) filter.status = q.status;
  if (q.search) filter.title = { $regex: q.search, $options: 'i' };
  return MenuItem.find(filter).sort({ createdAt: -1 });
};

exports.createItem = (restaurantId, payload) =>
  MenuItem.create({ restaurantId, ...payload });

exports.updateItem = async (id, payload) => {
  const doc = await MenuItem.findById(id);
  if (!doc) throw Object.assign(new Error('Item not found'), { status: 404 });
  Object.assign(doc, payload);
  await doc.save();
  return doc;
};

exports.removeItem = async (id) => {
  const doc = await MenuItem.findById(id);
  if (!doc) throw Object.assign(new Error('Item not found'), { status: 404 });
  await doc.deleteOne();
};
