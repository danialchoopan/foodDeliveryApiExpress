const { Router } = require('express');
const { rateLimit } = require('../middlewares/rateLimiter');
const ctrl = require('../controllers/auth.controller');
const router = Router();

router.post('/register', ctrl.register);
router.post('/login', rateLimit, ctrl.login);
router.get('/me', require('../middlewares/auth').auth, ctrl.me);

module.exports = router;
