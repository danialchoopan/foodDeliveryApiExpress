module.exports.makeSlug = (str = '') =>
  String(str)
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\u0600-\u06FFa-z0-9\-]+/g, '')
    .replace(/\-+/g, '-');
