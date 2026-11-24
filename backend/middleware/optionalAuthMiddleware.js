
const jwt = require("jsonwebtoken");

const optionalAuth = (req, res, next) => {
  const authHeader =
    req.headers.authorization;

  // =================================
  // No token
  // =================================

  if (!authHeader) {
    req.user = null;

    return next();
  }

  const token =
    authHeader.split(" ")[1];

  // =================================
  // Authorization header exists
  // but token is missing
  // =================================

  if (!token) {
    req.user = null;

    return next();
  }

  // =================================
  // Verify token
  // =================================

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

  } catch (error) {
    // An invalid/expired token should
    // not prevent public posts from
    // being viewed.

    req.user = null;
  }

  next();
};

module.exports = optionalAuth;