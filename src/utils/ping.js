module.exports.health = (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
};
