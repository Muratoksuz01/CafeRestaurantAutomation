const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT Secret - Production'da environment variable'dan alınmalı
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Token oluşturma fonksiyonu
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
};
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    // Token'ı doğrula
    const decoded = jwt.verify(token, JWT_SECRET);

    // Kullanıcıyı bul
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token - user not found'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Kullanıcı bilgilerini request'e ekle
    req.user = {
      id: user._id,
      firstName: user.firstName,
      role: user.role
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
module.exports = {
  generateToken,
  authenticateToken,
  //   optionalAuth,
  //   JWT_SECRET
};