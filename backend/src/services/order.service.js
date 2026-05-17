const prisma = require('../config/db');
const razorpay = require('../config/razorpay');
const { calculateGST } = require('../utils/gst');
const AppError = require('../middlewares/errorHandler');
const { sendOrderConfirmationEmail } = require('./email.service');

const createOrder = async (userId, { addressId, couponCode, paymentMethod }) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Fetch cart items
    const cartItems = await tx.cartItem.findMany({
      where: { userId },
      include: { product: true }
    });

    if (cartItems.length === 0) throw new AppError('Cart is empty', 400);

    let subtotal = 0;
    let totalGstAmount = 0;
    const orderItemsData = [];

    // 2. Validate stock & 3. Calculate subtotal & 5. GST per item
    for (const item of cartItems) {
      const { product, quantity } = item;
      
      if (!product.isActive) throw new AppError(`Product ${product.name} is no longer available`, 400);
      if (product.stock < quantity) throw new AppError(`Insufficient stock for ${product.name}`, 400);

      const itemPrice = parseFloat(product.salePrice || product.basePrice);
      const itemSubtotal = itemPrice * quantity;
      
      subtotal += itemSubtotal;

      const { gstAmount } = calculateGST(itemPrice, parseFloat(product.gstPercent));
      totalGstAmount += (gstAmount * quantity);

      orderItemsData.push({
        productId: product.id,
        name: product.name,
        sku: product.sku,
        quantity: quantity,
        unitPrice: itemPrice,
        gstPercent: product.gstPercent,
        totalPrice: itemSubtotal
      });

      // 10. Decrement stock
      await tx.product.update({
        where: { id: product.id },
        data: { stock: { decrement: quantity } }
      });
    }

    // 4. Apply Coupon
    let discountAmount = 0;
    let couponId = null;
    if (couponCode) {
      const coupon = await tx.coupon.findUnique({ where: { code: couponCode } });
      if (!coupon || !coupon.isActive || new Date() > coupon.validTo || new Date() < coupon.validFrom) {
        throw new AppError('Invalid or expired coupon', 400);
      }
      if (subtotal < parseFloat(coupon.minOrderValue || 0)) {
        throw new AppError(`Minimum order value of ₹${coupon.minOrderValue} required`, 400);
      }
      
      discountAmount = coupon.type === 'PERCENTAGE' 
        ? (subtotal * parseFloat(coupon.value)) / 100 
        : parseFloat(coupon.value);

      if (coupon.maxDiscount && discountAmount > parseFloat(coupon.maxDiscount)) {
        discountAmount = parseFloat(coupon.maxDiscount);
      }

      couponId = coupon.id;
      // 11. Increment coupon usage
      await tx.coupon.update({
        where: { id: coupon.id },
        data: { usageCount: { increment: 1 } }
      });
    }

    // 6. Determine shipping (Free > 499)
    const shippingCharge = (subtotal - discountAmount) > 499 ? 0 : 50;

    // 7. Calculate total
    const total = subtotal - discountAmount + shippingCharge;

    // 8. Generate orderNumber
    const year = new Date().getFullYear();
    const orderCount = await tx.order.count();
    const orderNumber = `RBU-${year}-${String(orderCount + 1).padStart(5, '0')}`;

    // 9. Create Order
    const order = await tx.order.create({
      data: {
        orderNumber,
        userId,
        addressId,
        couponId,
        subtotal,
        discountAmount,
        gstAmount: totalGstAmount,
        shippingCharge,
        total,
        paymentMethod,
        items: { create: orderItemsData },
        statusHistory: {
          create: { status: 'PENDING', note: 'Order created' }
        }
      },
      include: { items: true, address: true }
    });

    // 12. Clear user's cart
    await tx.cartItem.deleteMany({ where: { userId } });

    // 13. Create Razorpay order if applicable
    let razorpayOrderId = null;
    if (paymentMethod === 'razorpay') {
      const rpOrder = await razorpay.orders.create({
        amount: Math.round(total * 100), // convert to paise
        currency: "INR",
        receipt: orderNumber
      });
      razorpayOrderId = rpOrder.id;

      await tx.payment.create({
        data: {
          orderId: order.id,
          razorpayOrderId: rpOrder.id,
          amount: total,
          method: 'razorpay'
        }
      });
    }

    // 14. Send email (Async)
    const user = await tx.user.findUnique({ where: { id: userId } });
    sendOrderConfirmationEmail(user.email, order).catch(console.error);

    // 15. Return
    return { order, razorpayOrderId };
  });
};

module.exports = { createOrder };