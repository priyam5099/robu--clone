const crypto = require('crypto');
const prisma = require('../config/db');
const AppError = require('../middlewares/errorHandler');

const verifyPayment = async ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
  const body = razorpayOrderId + "|" + razorpayPaymentId;
  
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(razorpaySignature)
  );

  if (!isAuthentic) {
    throw new AppError('Payment verification failed. Invalid signature.', 400);
  }

  // Update DB records
  return await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.update({
      where: { razorpayOrderId },
      data: {
        razorpayPaymentId,
        razorpaySignature,
        status: 'PAID'
      }
    });

    await tx.order.update({
      where: { id: payment.orderId },
      data: {
        paymentStatus: 'PAID',
        status: 'CONFIRMED'
      }
    });

    await tx.orderStatusHistory.create({
      data: {
        orderId: payment.orderId,
        status: 'CONFIRMED',
        note: 'Payment verified successfully.'
      }
    });

    return { success: true, orderId: payment.orderId };
  });
};

module.exports = { verifyPayment };