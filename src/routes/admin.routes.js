const { Router } = require('express');
const { auth, isAdmin } = require('../middlewares/auth');
const ctrl = require('../controllers/admin.controller');
const router = Router();

router.get('/users', auth, isAdmin, ctrl.listUsers);
router.get('/orders', auth, isAdmin, ctrl.listOrders);
router.patch('/orders/:id/status', auth, isAdmin, ctrl.setOrderStatus);
router.post('/vendors/:userId/approve', auth, isAdmin, ctrl.approveVendor);
router.get('/vendors/:vendorId/restaurants', auth, isAdmin, ctrl.listVendorRestaurants);

module.exports = router;
