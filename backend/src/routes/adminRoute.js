const express = require('express');
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
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
} = require('../controllers/adminController');
const multer = require("multer");
const path = require("path");

// Kayıt dizini ve filename ayarı
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "assets/foods"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = file.originalname + "-" + Date.now() + ext;
    cb(null, name);
  }
});
const upload = multer({ storage });
router.get('/foods', authenticateToken, getFoods);
router.post('/food', authenticateToken, upload.array("imgs", 2), createFood);
router.delete('/food/:id', authenticateToken, deleteFood);
router.put('/food/:id', authenticateToken, updateFood);

router.put("/giveAproach/:id", authenticateToken, giveAproach)
router.put("/giveReject/:id", authenticateToken, giveReject);
router.delete("/deleteUser/:id", authenticateToken, deleteUser);
router.get('/getUsers', authenticateToken, getUsers);


router.get("/categories", authenticateToken, getCategories);
router.post("/category", authenticateToken, createCategory);
router.put("/category/:id", authenticateToken, updateCategory);
router.delete("/category/:id", authenticateToken, deleteCategory);


module.exports = router;

