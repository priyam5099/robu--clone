const express = require('express');
const router = express.Router();

// We will import the individual route files here. 
// (Note: You will need to create these files in the routes folder later to avoid module not found errors)
const authRoutes = require('./auth.routes');
const productRoutes = require('./product.routes');
const orderRoutes = require('./order.routes');
const cartRoutes = require('./cart.routes');
const paymentRoutes = require('./payment.routes');

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/payments', paymentRoutes);

// Temporary test route to verify the server is running
router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running perfectly!' });
});

module.exports = router;