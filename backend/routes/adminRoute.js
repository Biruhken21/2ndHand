const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/role');
const {
  getPendingProducts,
  approveProduct,
  getAllProducts,
  getAllUsers,
  getAllInquiries
} = require('../controllers/adminController');

// =================== PRODUCT MANAGEMENT ===================
// Get pending products for approval (admin only)
router.get('/products/pending', protect, admin, getPendingProducts);

// Approve or reject pending product (admin only)
router.put('/products/:id/approve', protect, admin, approveProduct);

// Get all products (admin view with filters)
router.get('/products', protect, admin, getAllProducts);

// =================== USER MANAGEMENT ===================
// Get all users (admin only)
router.get('/users', protect, admin, getAllUsers);

// =================== INQUIRY MANAGEMENT ===================
// Get all inquiries (admin only)
router.get('/inquiries', protect, admin, getAllInquiries);

module.exports = router;