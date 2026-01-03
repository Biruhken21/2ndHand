const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/role');
const { uploadProductImages} = require('../middleware/upload');
const {
  getPendingProducts,
  approveProduct,
  getAllProducts,
  getAllUsers,
  getAllInquiries,
  createProduct
} = require('../controllers/adminController');

// =================== PRODUCT MANAGEMENT ===================
// Get pending products for approval (admin only)
router.get('/products/pending', protect, admin, getPendingProducts);

// Approve or reject pending product (admin only)
router.put('/products/:id/approve', protect, admin, approveProduct);

// Get all products 
router.get('/products', protect, admin, getAllProducts);
// get all users
router.get('/users', protect, admin, getAllUsers);
//get users inquiries
router.get('/inquiries', protect, admin, getAllInquiries);
// create new product
router.post('/products', protect, admin, uploadProductImages, createProduct)

module.exports = router;