// productRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { uploadProductImages } = require('../middleware/upload');

const {
  createProduct,
  getApprovedProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  getProductsByUser,
  getMyProducts, // ADD THIS
  markAsSold,
} = require('../controllers/productController');

// Public routes
router.get('/', getApprovedProducts);
router.get('/:id', getProductById);

// Protected routes
router.post('/', protect, uploadProductImages, createProduct);
router.delete('/:id', protect, deleteProduct);
router.put('/:id', protect, uploadProductImages, updateProduct);

// Get user's products - TWO ROUTES
router.get('/user/my-products', protect, getMyProducts); // NEW - for current user
router.get('/user/:userId', protect, getProductsByUser); // For other users (admin/optional)

// Mark as sold
router.put('/:id/sold', markAsSold);

module.exports = router;