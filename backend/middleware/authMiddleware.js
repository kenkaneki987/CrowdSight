const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access denied. No token provided.',
        hint: 'Please provide a token in Authorization header as "Bearer <token>"'
      });
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Set user data in the expected format for routes
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role || 'user' // Include role from JWT payload
    };
    req.userId = decoded.userId; // Keep for backward compatibility
    req.userEmail = decoded.email; // Keep for backward compatibility

    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please login again.' });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

/**
 * Admin Middleware - Restricts access to admin users only
 * Must be used after authMiddleware to ensure req.user is populated
 */
const adminMiddleware = (req, res, next) => {
  try {
    // Check if user exists and has admin role
    if (req.user?.role === "admin") {
      return next();
    }
    
    // User is authenticated but not admin
    return res.status(403).json({
      success: false,
      error: "Access denied: Admins only",
      message: "You need admin privileges to access this resource"
    });
    
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Authorization failed' 
    });
  }
};

module.exports = { authMiddleware, adminMiddleware };
