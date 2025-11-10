const { Router } = require('express');
const { auth, isVendor } = require('../middlewares/auth');
const ctrl = require('../controllers/menu.controller');
const router = Router();

// Categories
router.get('/:restaurantId/categories', ctrl.listCategories);
router.post('/:restaurantId/categories', auth, isVendor, ctrl.createCategory);
router.put('/categories/:categoryId', auth, isVendor, ctrl.updateCategory);

// Items
router.get('/:restaurantId/items', ctrl.listItems);
router.post('/:restaurantId/items', auth, isVendor, ctrl.createItem);
router.put('/items/:itemId', auth, isVendor, ctrl.updateItem);
router.delete('/items/:itemId', auth, isVendor, ctrl.removeItem);

module.exports = router;
