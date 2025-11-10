const svc = require('../services/admin.service');

exports.listUsers = async (req, res, next) => {
  try { res.json(await svc.listUsers(req.query)); }
  catch (e) { next(e); }
};

exports.listOrders = async (req, res, next) => {
  try { res.json(await svc.listOrders(req.query)); }
  catch (e) { next(e); }
};

exports.setOrderStatus = async (req, res, next) => {
  try { res.json(await svc.setOrderStatus(req.user.id, req.params.id, req.body.status)); }
  catch (e) { next(e); }
};

exports.approveVendor = async (req, res, next) => {
  try { res.json(await svc.approveVendor(req.user.id, req.params.userId)); }
  catch (e) { next(e); }
};

exports.listVendorRestaurants = async (req, res, next) => {
  try { res.json(await svc.listVendorsRestaurants(req.params.vendorId)); }
  catch (e) { next(e); }
};
