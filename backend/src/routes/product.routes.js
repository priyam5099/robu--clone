const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Import your auth middleware (to verify the JWT token) and the new restrictTo function
const { verifyToken } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../controllers/auth.controller');

// Anyone can view products (No middleware)
router.get('/', productController.getProducts);

// ONLY Admins and Vendors can add new products
router.post(
  '/', 
  verifyToken,                           // 1. Checks if they are logged in
  restrictTo('ADMIN', 'VENDOR'),         // 2. Checks if they have permission
  productController.addProduct           // 3. Runs the product creation
);

module.exports = router;