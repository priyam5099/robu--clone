const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const { generateTokens, signAccessToken } = require('../utils/tokenManager');

// --- 1. REGISTER (With Email Validation) ---
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    
    // NEW: Check if email is already in use
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'This email is already in use. Please log in or use a different email.' 
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    
    const user = await prisma.user.create({
      data: { name, email, passwordHash, phone }
    });

    const tokens = generateTokens(user);
    
    res.status(201).json({
      success: true,
      data: { user: { id: user.id, name: user.name, email: user.email, role: user.role }, ...tokens }
    });
  } catch (error) {
    next(error);
  }
};

// --- 2. LOGIN (With Specific Password Errors) ---
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    
    // Check 1: Does the email exist?
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email.' });
    }

    // Check 2: Does the password match?
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Password error: Incorrect password.' });
    }

    const tokens = generateTokens(user);
    
    res.json({
      success: true,
      data: { user: { id: user.id, name: user.name, role: user.role }, ...tokens }
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, message: 'Refresh token is required' });

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = signAccessToken({ id: decoded.id, role: decoded.role });

    res.json({ success: true, data: { accessToken } });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
};

exports.sendOtp = async (req, res, next) => {
  try {
    const { target, purpose } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    await prisma.oTP.create({
      data: {
        target,
        code,
        purpose,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000)
      }
    });

    console.log(`OTP for ${target} is ${code}`); 
    res.json({ success: true, message: `OTP sent to ${target}` });
  } catch (error) {
    next(error);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { target, code, purpose } = req.body;

    const otpRecord = await prisma.oTP.findFirst({
      where: { target, code, purpose, used: false, expiresAt: { gt: new Date() } }
    });

    if (!otpRecord) return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });

    await prisma.oTP.update({ where: { id: otpRecord.id }, data: { used: true } });

    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    
    await prisma.oTP.create({
      data: { target: email, code: resetToken, purpose: 'PASSWORD_RESET', expiresAt: new Date(Date.now() + 15 * 60 * 1000) }
    });

    console.log(`Password reset token for ${email}: ${resetToken}`);
    res.json({ success: true, message: 'Password reset instructions sent to email' });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, token, newPassword } = req.body;

    const otpRecord = await prisma.oTP.findFirst({
      where: { target: email, code: token, purpose: 'PASSWORD_RESET', used: false, expiresAt: { gt: new Date() } }
    });

    if (!otpRecord) return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { email },
      data: { passwordHash }
    });

    await prisma.oTP.update({ where: { id: otpRecord.id }, data: { used: true } });

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

// --- 3. ADMIN/SELLER AUTHORIZATION MIDDLEWARE ---
// You can export this to use in your product routes
exports.restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    // This assumes your verifyToken middleware has already run and attached the user's role to req.user
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: Only verified Admins and Vendors can update the products list.'
      });
    }
    next();
  };
};