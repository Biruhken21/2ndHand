const express = require('express');
const { 
  register, 
  login, 
  logout, 
  getMe, 
  updateProfile 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { 
  validateRegister, 
  validateLogin, 
  validateUpdateProfile 
} = require('../middleware/validation');

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, validateUpdateProfile, updateProfile);

module.exports = router;