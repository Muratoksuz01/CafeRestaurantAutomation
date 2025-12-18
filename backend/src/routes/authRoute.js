const express = require('express');
const router = express.Router();

const {register,login} = require('../controllers/auth/authController');


router.post('/register', register);
router.post('/login', login);


// router.get("/me/permissions",authenticateToken,permissions)
// router.put('/profile', authenticateToken, updateProfile);
// router.put('/change-password', authenticateToken, changePassword);

module.exports = router;
