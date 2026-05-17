const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth');

// Public routes (No login required)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes (Require a valid JWT token)
// We use the verifyToken middleware to ensure only logged-in users can access these
router.get('/me', verifyToken, async (req, res) => {
  // req.user is set by the verifyToken middleware
  res.json({
    success: true,
    data: { user: req.user }
  });
});


router.post('/logout', verifyToken, authController.logout);
router.post('/refresh', authController.refreshToken);
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;