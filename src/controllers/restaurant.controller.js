const svc = require('../services/restaurant.service');

exports.list = async (req, res, next) => {
  try { res.json(await svc.list(req.query)); }
  catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try { res.status(201).json(await svc.create(req.user.id, req.body)); }
  catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    res.json(await svc.update(req.params.id, req.user.id, req.body, isAdmin));
  } catch (e) { next(e); }
};
