const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  console.log('=== AUTH DEBUG ===');
  console.log('1. Checking cookies:', req.cookies);
  console.log('2. Checking auth header:', req.headers.authorization);

  // METHOD 1: Get token from COOKIE (for web browsers)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log('✓ Token found in COOKIE');
  }

  // METHOD 2: Get token from Authorization header (for Postman/mobile apps)
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('✓ Token found in AUTHORIZATION HEADER');
  }

  // METHOD 3: (Optional) Get token from query string
  if (!token && req.query.token) {
    token = req.query.token;
    console.log('✓ Token found in QUERY STRING');
  }

  // Check if token exists anywhere
  console.log('3. Final token status:', token ? 'FOUND' : 'NOT FOUND');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Please login to access this resource. No authentication token found.'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('4. Token decoded successfully. User ID:', decoded.userId);
    
    // Get user from token
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.log('5. User not found in database');
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('6. Authentication SUCCESS. User:', user.email);
    req.user = user;
    next();
  } catch (error) {
    console.log('7. Token verification ERROR:', error.name, '-', error.message);
    
    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again'
      });
    }

    // For other errors
    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};