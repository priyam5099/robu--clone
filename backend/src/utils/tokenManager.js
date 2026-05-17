const jwt = require('jsonwebtoken');

/**
 * Generates both Access and Refresh tokens for a user.
 * Access Token: Valid for 15 minutes (Short-lived for security)
 * Refresh Token: Valid for 7 days (Long-lived to keep user logged in)
 */
exports.generateTokens = (user) => {
  const payload = {
    id: user.id,
    role: user.role
  };

  const accessToken = jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

/**
 * Verifies a token against a specific secret.
 */
exports.verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};


exports.signAccessToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
};