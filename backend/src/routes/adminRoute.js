const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const multer = require("multer");
const authorize = require("../middleware/authorize");

const router = express.Router();
const {  getUser,getRoles,getUsers,
  deleteUser,
  getAdminStats,getPermissions,updatePermission,
  updateUser
} = require('../controllers/admin/userController');
const {
  reassign,createCategory,
  updateCategory,deleteCategory,
  getCategories, } = require("../controllers/admin/categoryController")
const { 
  createFood,updateFood,
  getFoods,deleteFood, 
} = require("../controllers/admin/foodController")

// Kayıt dizini ve filename ayarı
const upload = multer({ storage: multer.memoryStorage() });
router.post("/foods", authenticateToken, upload.array("imgs", 2), createFood)
router.put("/foods/:id", authenticateToken, upload.array("imgs", 2), updateFood)
router.delete("/foods/:id", authenticateToken, deleteFood)
router.get("/foods", getFoods)

router.get("/getUser/:id", authenticateToken, getUser)
router.get("/getUsers", authenticateToken, getUsers)
router.get("/getPermissions", authenticateToken, getPermissions)
router.get("/getAdminStats", authenticateToken, getAdminStats)
router.get("/getRoles", authenticateToken, getRoles)
// router.put("/giveAproach/:id", authenticateToken, giveAproach)
// router.put("/giveReject/:id", authenticateToken, giveReject)
router.delete("/deleteUser/:id", authenticateToken, deleteUser)
router.put("/updatePermission/:id", authenticateToken, updatePermission)
router.put("/updateUser/:id", authenticateToken, updateUser)

router.get("/categories", getCategories)
router.post("/categories", authenticateToken, createCategory)
router.put("/categories/:id", authenticateToken, updateCategory)
router.put("/categories/:id/reassign", authenticateToken, reassign)
router.delete("/categories/:id", authenticateToken, deleteCategory)



module.exports = router;

