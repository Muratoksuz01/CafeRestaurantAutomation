const express = require('express');
const Foods = require('../models/foods');
const Category = require("../models/Category");
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getUsers,
  createFood,
  deleteFood,
  giveAproach,
  giveReject,
  deleteUser,
  updateFood,
  getFoods,
  reassign,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
} = require('../controllers/adminController');
const multer = require("multer");
const path = require("path");

// Kayıt dizini ve filename ayarı
const upload = multer({ storage:multer.memoryStorage() });
router.put('/food/:id', authenticateToken,upload.array("imgs", 2), updateFood);
router.post('/food', authenticateToken, upload.array("imgs", 2), createFood);
router.get('/foods', authenticateToken, getFoods);
router.delete('/food/:id', authenticateToken, deleteFood);

router.put("/giveAproach/:id", authenticateToken, giveAproach)
router.put("/giveReject/:id", authenticateToken, giveReject);
router.delete("/deleteUser/:id", authenticateToken, deleteUser);
router.get('/getUsers', authenticateToken, getUsers);


router.get("/categories", authenticateToken, getCategories);
router.put("/categories/:id/reassign",authenticateToken, reassign);
router.post("/category", authenticateToken, createCategory);
router.put("/category/:id", authenticateToken, updateCategory);
router.delete("/category/:id", authenticateToken, deleteCategory);



module.exports = router;

