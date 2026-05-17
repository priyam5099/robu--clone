const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

exports.verifyToken = async (req, res, next) => {
  try {
    // 1. Check if the token exists in the headers
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'You are not logged in. Please log in to get access.' });
    }

    // 2. Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 3. Check if the user still exists in the database
    const currentUser = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!currentUser) {
      return res.status(401).json({ success: false, message: 'The user belonging to this token no longer exists.' });
    }

    // 4. Grant access and attach the user to the request
    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token. Please log in again.' });
  }
};