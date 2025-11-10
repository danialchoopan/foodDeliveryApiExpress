const svc = require('../services/order.service');

exports.listMy = async (req, res, next) => {
  try { res.json(await svc.listMyOrders(req.user.id)); }
  catch (e) { next(e); }
};

exports.createFromCart = async (req, res, next) => {
  try { res.status(201).json(await svc.createFromCart(req.user.id, req.body)); }
  catch (e) { next(e); }
};
