const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
 
} = require('../controllers/auth/authController');
// const { authenticateToken } = require('../middleware/auth');

// Public routes (kimlik doğrulama gerektirmez)
router.post('/register', register);
router.post('/login', login);
// Protected routes (kimlik doğrulama gerektirir)
router.get('/profile', authenticateToken, getProfile);


// router.put('/profile', authenticateToken, updateProfile);
// router.put('/change-password', authenticateToken, changePassword);

module.exports = router;
