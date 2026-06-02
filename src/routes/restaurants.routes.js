const { Router } = require('express');
const restaurantController = require('../controllers/restaurant.controller');
const { protect, restrictTo } = require('../middlewares/auth');

const router = Router();

router.get('/', restaurantController.listRestaurants);
router.get('/:slug', restaurantController.getRestaurantDetails);

router.post('/', protect, restrictTo('vendor', 'admin'), restaurantController.createRestaurant);
router.put('/:id', protect, restrictTo('vendor', 'admin'), restaurantController.updateRestaurant);

module.exports = router;
