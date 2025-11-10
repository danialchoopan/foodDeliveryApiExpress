const { Router } = require('express');
const { auth, isVendor, isAdmin } = require('../middlewares/auth');
const ctrl = require('../controllers/restaurant.controller');
const router = Router();

router.get('/', ctrl.list);
router.post('/', auth, isVendor, ctrl.create);
router.put('/:id', auth, ctrl.update);           // vendor owner or admin
router.patch('/:id', auth, ctrl.update);

module.exports = router;
