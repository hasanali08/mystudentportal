const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 * Verifies JWT token from Authorization header
 * Attaches user info to req.user
 */
const authenticateToken = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  // If no token, return 401 Unauthorized
  if (!token) {
    return res.status(401).json({
      error: 'Access denied. No token provided.'
    });
  }

  try {
    // Verify token using JWT_SECRET from environment
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    
    // Attach user info to request object
    req.user = decoded;
    
    // Continue to next middleware/route
    next();
  } catch (err) {
    // Token is invalid or expired
    return res.status(403).json({
      error: 'Invalid or expired token.'
    });
  }
};

module.exports = authenticateToken;

