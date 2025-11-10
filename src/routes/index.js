const { Router } = require('express');
const { health } = require('../utils/ping');

const authRoutes = require('./auth.routes');
const restaurantRoutes = require('./restaurants.routes');
const menuRoutes = require('./menus.routes');
const cartRoutes = require('./carts.routes');
const orderRoutes = require('./orders.routes');
const adminRoutes = require('./admin.routes');

const router = Router();

router.get('/health', health);

router.use('/auth', authRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/menus', menuRoutes);
router.use('/carts', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
