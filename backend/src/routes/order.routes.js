const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middlewares/auth');
const orderController = require('../controllers/order.controller');

// User Order Routes (Uncomment when order.controller.js is fully written)
router.post('/', verifyToken, orderController.createOrderHandler);
router.get('/', verifyToken, orderController.getUserOrders);
router.get('/:orderNumber', verifyToken, orderController.getOrderDetail);

// Admin Order Routes
router.get('/admin/all', verifyAdmin, orderController.getAllOrders);
router.patch('/admin/:id/status', verifyAdmin, orderController.updateOrderStatus);

module.exports = router;