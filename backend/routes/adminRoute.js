const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/role');
const {
  // Dashboard
  getDashboardStats,
  
  // Product Management
  getPendingProducts,
  getAllProducts,
  getProductById,
  approveProduct,
  updateProduct,
  deleteProduct,
  
  // Inquiry Management
  getAllInquiries,
  updateInquiryStatus,
  
  // User Management
  getAllUsers,
  updateUser
} = require('../controllers/adminController');

// All admin routes require authentication and admin role
router.use(protect);
router.use(admin);

// ==================== DASHBOARD ====================
router.get('/dashboard/stats', getDashboardStats);

// ==================== PRODUCT MANAGEMENT ====================
// Product approval
router.get('/products/pending', getPendingProducts);
router.put('/products/:id/approve', approveProduct);

// Product CRUD
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// ==================== INQUIRY MANAGEMENT ====================
router.get('/inquiries', getAllInquiries);
router.put('/inquiries/:inquiryId', updateInquiryStatus);

// ==================== USER MANAGEMENT ====================
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);

module.exports = router;