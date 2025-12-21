const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Import ONLY what you need
const {
  toggleFavorite,
  getFavorites,
  checkFavoriteStatus
} = require('../controllers/favoriteController');

const {
  incrementShare
} = require('../controllers/shareController');

const {
  contactSeller,
  getContactedProducts
} = require('../controllers/contactController');

const {
  getUserNotifications,
  markAsRead
} = require('../controllers/notificationController');

//favorite routes
router.put('/favorite/:productId', protect, toggleFavorite);
router.get('/favorites', protect, getFavorites);
router.get('/favorite/:productId/status', protect, checkFavoriteStatus);

// share route
router.put('/share/:productId', incrementShare);

// user contact routes
router.post('/contact/:productId', protect, contactSeller);
router.get('/contact/my-contacts', protect, getContactedProducts);

// notification routes
router.get('/notifications', protect, getUserNotifications);
router.put('/notifications/:id/mark-as-read', protect, markAsRead);

module.exports = router;