const svc = require('../services/menu.service');

exports.listCategories = async (req, res, next) => {
  try { res.json(await svc.listCategories(req.params.restaurantId)); }
  catch (e) { next(e); }
};

exports.createCategory = async (req, res, next) => {
  try { res.status(201).json(await svc.createCategory(req.params.restaurantId, req.body)); }
  catch (e) { next(e); }
};

exports.updateCategory = async (req, res, next) => {
  try { res.json(await svc.updateCategory(req.params.categoryId, req.body)); }
  catch (e) { next(e); }
};

exports.listItems = async (req, res, next) => {
  try { res.json(await svc.listItems(req.params.restaurantId, req.query)); }
  catch (e) { next(e); }
};

exports.createItem = async (req, res, next) => {
  try { res.status(201).json(await svc.createItem(req.params.restaurantId, req.body)); }
  catch (e) { next(e); }
};

exports.updateItem = async (req, res, next) => {
  try { res.json(await svc.updateItem(req.params.itemId, req.body)); }
  catch (e) { next(e); }
};

exports.removeItem = async (req, res, next) => {
  try { await svc.removeItem(req.params.itemId); res.status(204).end(); }
  catch (e) { next(e); }
};
