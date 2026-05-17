const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const cartController = require('../controllers/cart.controller');


router.get('/', verifyToken, cartController.getCart);
router.post('/items', verifyToken, cartController.addItemToCart);
router.patch('/items/:itemId', verifyToken, cartController.updateCartItemQty);
router.delete('/items/:itemId', verifyToken, cartController.removeCartItem);
router.delete('/', verifyToken, cartController.clearCart);

module.exports = router;