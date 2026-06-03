const { Router } = require('express');
const adminController = require('../controllers/admin.controller');
const { protect, restrictTo } = require('../middlewares/auth');

const router = Router();

router.use(protect, restrictTo('admin'));

router.get('/stats', adminController.getStats);
router.patch('/restaurants/:id/approve', adminController.approveRestaurant);
router.post('/coupons', adminController.createCoupon);

module.exports = router;
