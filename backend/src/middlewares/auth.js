const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const AppError = require('./errorHandler');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Unauthorized access. Token missing.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    next(new AppError('Invalid or expired token', 401));
  }
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      // Ignore error for optional auth
    }
  }
  next();
};

const verifyAdmin = [
  verifyToken,
  (req, res, next) => {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      return next(new AppError('Forbidden: Admin access required', 403));
    }
    next();
  }
];

const verifyVendor = [
  verifyToken,
  (req, res, next) => {
    if (['VENDOR', 'ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
      return next();
    }
    next(new AppError('Forbidden: Vendor access required', 403));
  }
];

module.exports = { verifyToken, optionalAuth, verifyAdmin, verifyVendor };