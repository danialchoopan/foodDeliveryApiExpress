const { Router } = require('express');
const { protect, restrictTo } = require('../middlewares/auth');
const ctrl = require('../controllers/menu.controller');
const router = Router();

// Categories
router.get('/:restaurantId/categories', ctrl.listCategories);
router.post('/:restaurantId/categories', protect, restrictTo('vendor', 'admin'), ctrl.createCategory);
router.put('/categories/:categoryId', protect, restrictTo('vendor', 'admin'), ctrl.updateCategory);

// Items
router.get('/:restaurantId/items', ctrl.listItems);
router.post('/:restaurantId/items', protect, restrictTo('vendor', 'admin'), ctrl.createItem);
router.put('/items/:itemId', protect, restrictTo('vendor', 'admin'), ctrl.updateItem);
router.delete('/items/:itemId', protect, restrictTo('vendor', 'admin'), ctrl.removeItem);

module.exports = router;
