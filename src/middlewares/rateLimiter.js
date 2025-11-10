const { RateLimiterMemory } = require('rate-limiter-flexible');

const opts = new RateLimiterMemory({
  points: 5,          // 5 requests
  duration: 10,       // per 10 seconds
});

module.exports.rateLimit = (req, res, next) => {
  const key = req.ip;
  opts.consume(key)
    .then(() => next())
    .catch(() => res.status(429).json({ message: 'Too Many Requests' }));
};
