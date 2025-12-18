const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

const {register,login,updateProfile,changePassword,permissions} = require('../controllers/auth/authController');
// const { authenticateToken } = require('../middleware/auth');


router.post('/register', register);
router.post('/login', login);

router.get("/me/permissions",authenticateToken,permissions)

// router.put('/profile', authenticateToken, updateProfile);
// router.put('/change-password', authenticateToken, changePassword);

module.exports = router;
