const jwt = require('jsonwebtoken');
const User = require('../models/User');
exports.protect = async (req, res, next) => {
  try {
    console.log('=== PROTECT MIDDLEWARE CALLED ===');
    console.log('Authorization header:', req.headers.authorization);
    console.log('Cookies:', req.cookies);
    
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token from header:', token ? 'YES' : 'NO');
    } 
    // Get token from cookie
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
      console.log('Token from cookie:', token ? 'YES' : 'NO');
    }

    // Check if token exists
    if (!token) {
      console.log(' NO TOKEN FOUND');
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    console.log('Token found, verifying...');
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(' Token decoded:', decoded);
      
      // Get user from token
      req.user = await User.findById(decoded.userId);
      
      if (!req.user) {
        console.log(' USER NOT FOUND IN DATABASE');
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      console.log(' User found:', req.user.email);
      console.log('User ID:', req.user._id);
      
      next();
    } catch (error) {
      console.log('TOKEN VERIFICATION FAILED:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
        error: error.message // Add for debugging
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};