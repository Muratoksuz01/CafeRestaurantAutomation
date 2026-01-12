const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const multer = require("multer");
const authorize = require("../middleware/authorize");

const router = express.Router();
const {  getUser,getRoles,getUsers,
  deleteUser,createUser,getAdminStats,
  updateUser
} = require('../controllers/userController');
const {
  reassign,createCategory,
  updateCategory,deleteCategory,
  getCategories, } = require("../controllers/categoryController")
const { 
  createFood,updateFood,
  getFoods,deleteFood, 
} = require("../controllers/foodController")

// Kayıt dizini ve filename ayarı
const upload = multer({ storage: multer.memoryStorage() });
router.post("/food", authenticateToken, upload.array("imgs", 2), createFood)
router.put("/food/:id", authenticateToken, upload.array("imgs", 2), updateFood)
router.delete("/food/:id", authenticateToken, deleteFood)
router.get("/food", getFoods)

router.post("/createUser", authenticateToken, createUser)
router.get("/getUser/:id", authenticateToken, getUser)
router.get("/getUsers", authenticateToken, getUsers)
// router.get("/getPermissions", authenticateToken, getPermissions)
router.get("/getAdminStats", authenticateToken, getAdminStats)
router.get("/getRoles", authenticateToken, getRoles)
// router.put("/giveAproach/:id", authenticateToken, giveAproach)
// router.put("/giveReject/:id", authenticateToken, giveReject)
router.delete("/deleteUser/:id", authenticateToken, deleteUser)
// router.put("/updatePermission/:id", authenticateToken, updatePermission)
router.put("/updateUser/:id", authenticateToken, updateUser)

router.get("/categories", getCategories)
router.post("/categories", authenticateToken, createCategory)
router.put("/categories/:id", authenticateToken, updateCategory)
router.put("/categories/:id/reassign", authenticateToken, reassign)
router.delete("/categories/:id", authenticateToken, deleteCategory)



module.exports = router;

