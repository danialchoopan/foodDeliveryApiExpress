const { Router } = require('express');
const orderController = require('../controllers/order.controller');
const { protect, restrictTo } = require('../middlewares/auth');

const router = Router();

router.use(protect);

router.post('/', restrictTo('customer'), orderController.placeOrder);
router.get('/my', orderController.getMyOrders);
router.get('/:id', orderController.getOrderDetails);
router.patch('/:id/status', restrictTo('vendor', 'courier', 'admin'), orderController.updateOrderStatus);
router.patch('/:id/assign', restrictTo('courier'), orderController.assignCourier);

module.exports = router;
