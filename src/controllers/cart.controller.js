const svc = require('../services/cart.service');

exports.getMyCart = async (req, res, next) => {
  try { res.json(await svc.getMyCart(req.user.id, req.query.restaurantId)); }
  catch (e) { next(e); }
};

exports.addItem = async (req, res, next) => {
  try {
    const { restaurantId } = req.body;
    const cart = await svc.addItem(req.user.id, restaurantId, req.body);
    res.status(201).json(cart);
  } catch (e) { next(e); }
};

exports.updateItem = async (req, res, next) => {
  try {
    const { restaurantId, quantity } = req.body;
    const cart = await svc.updateItem(req.user.id, restaurantId, req.params.itemId, quantity);
    res.json(cart);
  } catch (e) { next(e); }
};

exports.removeItem = async (req, res, next) => {
  try {
    const { restaurantId } = req.body;
    const cart = await svc.removeItem(req.user.id, restaurantId, req.params.itemId);
    res.json(cart);
  } catch (e) { next(e); }
};

exports.clear = async (req, res, next) => {
  try {
    const { restaurantId } = req.body;
    const cart = await svc.clear(req.user.id, restaurantId);
    res.json(cart);
  } catch (e) { next(e); }
};
