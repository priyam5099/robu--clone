const prisma = require('../config/db');
const AppError = require('../middlewares/errorHandler');

exports.getCart = async (req, res, next) => {
  try {
    const items = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          select: { id: true, name: true, slug: true, basePrice: true, salePrice: true, stock: true, images: { where: { isPrimary: true } } }
        }
      },
      orderBy: { addedAt: 'desc' }
    });

    res.json({ success: true, data: { items } });
  } catch (error) {
    next(error);
  }
};

exports.addItemToCart = async (req, res, next) => {
  try {
    const { productId, variantId, quantity = 1 } = req.body;
    const userId = req.user.id;

    // 1. Check if product exists and has stock
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new AppError('Product not found', 404);
    if (!product.isActive) throw new AppError('Product is no longer available', 400);
    if (product.stock < quantity) throw new AppError(`Only ${product.stock} items left in stock`, 400);

    // 2. Check if item is already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: { userId, productId, variantId }
    });

    let cartItem;
    if (existingItem) {
      // Update quantity if it doesn't exceed stock or maxOrderQty
      const newQty = existingItem.quantity + quantity;
      if (newQty > product.stock) throw new AppError('Cannot add more than available stock', 400);
      if (product.maxOrderQty && newQty > product.maxOrderQty) throw new AppError(`Maximum limit of ${product.maxOrderQty} reached`, 400);

      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty }
      });
    } else {
      // Add new item
      cartItem = await prisma.cartItem.create({
        data: { userId, productId, variantId, quantity }
      });
    }

    res.status(201).json({ success: true, message: 'Item added to cart', data: cartItem });
  } catch (error) {
    next(error);
  }
};

exports.updateCartItemQty = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) throw new AppError('Quantity must be at least 1', 400);

    const item = await prisma.cartItem.findUnique({ where: { id: itemId }, include: { product: true } });
    if (!item) throw new AppError('Cart item not found', 404);
    if (item.userId !== req.user.id) throw new AppError('Unauthorized', 403);
    if (item.product.stock < quantity) throw new AppError(`Only ${item.product.stock} items left in stock`, 400);

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    });

    res.json({ success: true, message: 'Cart updated', data: updatedItem });
  } catch (error) {
    next(error);
  }
};

exports.removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    
    const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
    if (!item) throw new AppError('Cart item not found', 404);
    if (item.userId !== req.user.id) throw new AppError('Unauthorized', 403);

    await prisma.cartItem.delete({ where: { id: itemId } });

    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    next(error);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};