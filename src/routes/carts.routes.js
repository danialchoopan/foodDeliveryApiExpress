const { Router } = require('express');
const { protect } = require('../middlewares/auth');
const ctrl = require('../controllers/cart.controller');
const router = Router();

router.use(protect);

router.get('/', ctrl.getCart);
router.post('/items', ctrl.addItem);
router.delete('/items/:itemId', ctrl.removeItem);
router.delete('/', ctrl.clearCart);

module.exports = router;
