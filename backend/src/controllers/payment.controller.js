const crypto = require('crypto');
const AppError = require('../middlewares/errorHandler');
const { verifyPayment } = require('../services/payment.service');

exports.verifyPaymentHandler = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      throw new AppError('Missing payment verification details', 400);
    }

    // Call the service we built earlier
    const result = await verifyPayment({ razorpayOrderId, razorpayPaymentId, razorpaySignature });

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

exports.razorpayWebhook = async (req, res, next) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    
    // Verify Webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).send('Invalid webhook signature');
    }

    const event = req.body.event;
    const paymentData = req.body.payload.payment.entity;

    // Handle different webhook events
    if (event === 'payment.captured') {
      // Payment successful in the background
      console.log(`Webhook: Payment ${paymentData.id} captured successfully.`);
      // Logic to update DB if it wasn't already updated by the frontend verification
    } else if (event === 'payment.failed') {
      console.log(`Webhook: Payment ${paymentData.id} failed.`);
      // Logic to update order status to FAILED
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Webhook Processing Error');
  }
};