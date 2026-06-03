const { MenuCategory, MenuItem } = require('../models');

exports.listCategories = async (req, res, next) => {
  try {
    const categories = await MenuCategory.find({ restaurantId: req.params.restaurantId });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const category = await MenuCategory.create({ ...req.body, restaurantId: req.params.restaurantId });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await MenuCategory.findByIdAndUpdate(req.params.categoryId, req.body, { new: true });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

exports.listItems = async (req, res, next) => {
  try {
    const items = await MenuItem.find({ restaurantId: req.params.restaurantId });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.createItem = async (req, res, next) => {
  try {
    const item = await MenuItem.create({ ...req.body, restaurantId: req.params.restaurantId });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.itemId, req.body, { new: true });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.removeItem = async (req, res, next) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.itemId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
