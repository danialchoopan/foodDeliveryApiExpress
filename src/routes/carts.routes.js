const { Router } = require('express');
const { auth } = require('../middlewares/auth');
const ctrl = require('../controllers/cart.controller');
const router = Router();

router.get('/me', auth, ctrl.getMyCart);
router.post('/me/items', auth, ctrl.addItem);
router.put('/me/items/:itemId', auth, ctrl.updateItem);
router.delete('/me/items/:itemId', auth, ctrl.removeItem);
router.delete('/me', auth, ctrl.clear);

module.exports = router;
