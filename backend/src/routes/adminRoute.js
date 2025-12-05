const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const multer = require("multer");
const path = require("path");
const router = express.Router();
const {
  getUsers,
  giveAproach,
  giveReject,
  deleteUser,
} = require('../controllers/admin/userController');
const {
  reassign,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories, } = require("../controllers/admin/categoryController")
const { 
  createFood,
  updateFood,
  getFoods,
  deleteFood, } = require("../controllers/admin/foodController")

// Kayıt dizini ve filename ayarı
const upload = multer({ storage: multer.memoryStorage() });
router.put('/food/:id', authenticateToken, upload.array("imgs", 2), updateFood);
router.post('/food', authenticateToken, upload.array("imgs", 2), createFood);
router.get('/foods', authenticateToken, getFoods);
router.delete('/food/:id', authenticateToken, deleteFood);

router.put("/giveAproach/:id", authenticateToken, giveAproach)
router.put("/giveReject/:id", authenticateToken, giveReject);
router.delete("/deleteUser/:id", authenticateToken, deleteUser);
router.get('/getUsers', authenticateToken, getUsers);


router.get("/categories", authenticateToken, getCategories);
router.put("/categories/:id/reassign", authenticateToken, reassign);
router.post("/category", authenticateToken, createCategory);
router.put("/category/:id", authenticateToken, updateCategory);
router.delete("/category/:id", authenticateToken, deleteCategory);



module.exports = router;

