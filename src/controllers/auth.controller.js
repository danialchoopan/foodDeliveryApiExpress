const svc = require('../services/auth.service');

exports.register = async (req, res, next) => {
  try { res.status(201).json(await svc.register(req.body)); }
  catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try { res.json(await svc.login(req.body)); }
  catch (e) { next(e); }
};

exports.me = async (req, res, next) => {
  try { res.json(await svc.me(req.user.id)); }
  catch (e) { next(e); }
};
