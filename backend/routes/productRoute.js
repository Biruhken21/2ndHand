const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { uploadProductImages } = require('../middleware/upload'); // IMPORT THIS

const {
  createProduct,  // Now this is just the handler function
  getApprovedProducts,
  markAsSold,
 
} = require('../controllers/productController');

// Public routes
router.get('/', getApprovedProducts);
// Combine upload middleware with createProduct handler
router.post('/', protect, uploadProductImages, createProduct);
// Mark as sold
router.put('/:id/sold', markAsSold);

module.exports = router;