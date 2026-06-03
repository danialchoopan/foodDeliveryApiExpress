const { Router } = require('express');
const authController = require('../controllers/auth.controller');

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/otp/send', authController.sendOTP);
router.post('/otp/verify', authController.verifyOTP);

module.exports = router;
