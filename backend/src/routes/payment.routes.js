const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const paymentController = require('../controllers/payment.controller');

// Payment verification endpoint (Uncomment when payment.controller.js is written)
router.post('/verify', verifyToken, paymentController.verifyPaymentHandler);

// Razorpay Webhook (No auth required, Razorpay sends this automatically)
router.post('/webhook', paymentController.razorpayWebhook);

module.exports = router;