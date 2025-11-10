const { Router } = require('express');
const { auth } = require('../middlewares/auth');
const ctrl = require('../controllers/order.controller');
const router = Router();

router.get('/me', auth, ctrl.listMy);
router.post('/from-cart', auth, ctrl.createFromCart);

module.exports = router;
