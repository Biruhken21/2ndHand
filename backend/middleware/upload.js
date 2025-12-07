const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 3 // MAX 3 images as required
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      const error = new Error('Only image files are allowed (jpeg, jpg, png, webp)');
      error.code = 'INVALID_FILE_TYPE';
      return cb(error);
    }
  }
});

// Wrap upload.array with error handling
const uploadWithErrorHandling = (req, res, next) => {
  upload.array('images', 3)(req, res, (err) => {
    if (err) {
      // Handle Multer errors
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 5MB per file'
        });
      }
      
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          success: false,
          message: 'Too many files. Maximum 3 images allowed'
        });
      }
      
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
          success: false,
          message: 'Unexpected field. Please use "images" as the field name for file uploads'
        });
      }
      
      if (err.code === 'INVALID_FILE_TYPE') {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      
      // Generic Multer error
      if (err.name === 'MulterError') {
        return res.status(400).json({
          success: false,
          message: `File upload error: ${err.message}`
        });
      }
      
      // Other errors
      return res.status(400).json({
        success: false,
        message: 'File upload failed',
        error: err.message
      });
    }
    next();
  });
};

// Validate 1-3 images as required
const validateImages = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please upload at least 1 image'
    });
  }
  
  if (req.files.length > 3) {
    return res.status(400).json({
      success: false,
      message: 'Maximum 3 images allowed'
    });
  }
  
  next();
};

// Export as array with error handling
const uploadProductImages = [uploadWithErrorHandling, validateImages];

module.exports = { uploadProductImages };