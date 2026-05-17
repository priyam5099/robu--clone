const prisma = require('../config/db');
const AppError = require('../middlewares/errorHandler');
const { createOrder } = require('../services/order.service');

exports.createOrderHandler = async (req, res, next) => {
  try {
    const { addressId, couponCode, paymentMethod } = req.body;
    
    if (!addressId) throw new AppError('Shipping address is required', 400);
    if (!paymentMethod) throw new AppError('Payment method is required', 400);

    // Call the massive service function we wrote earlier
    const result = await createOrder(req.user.id, { addressId, couponCode, paymentMethod });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: parseInt(limit)
    });

    const total = await prisma.order.count({ where: { userId: req.user.id } });

    res.json({
      success: true,
      data: orders,
      meta: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrderDetail = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true, address: true, payment: true, statusHistory: { orderBy: { createdAt: 'desc' } } }
    });

    if (!order) throw new AppError('Order not found', 404);
    
    // Ensure users can only view their own orders (unless they are an admin)
    if (order.userId !== req.user.id && !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
      throw new AppError('Unauthorized access to this order', 403);
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    const where = status ? { status } : {};

    const orders = await prisma.order.findMany({
      where,
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: parseInt(limit)
    });

    const total = await prisma.order.count({ where });

    res.json({ success: true, data: orders, meta: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        statusHistory: {
          create: { status, note }
        }
      }
    });

    res.json({ success: true, message: `Order status updated to ${status}`, data: order });
  } catch (error) {
    next(error);
  }
};