const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const multer = require("multer");
const authorize = require("../middleware/authorize");

const router = express.Router();
const {  getUser,getRoles,getUsers,
  giveAproach,giveReject,deleteUser,
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
router.post("/foods", authenticateToken, authorize("Food.Create"), upload.array("imgs", 2), createFood)
router.put("/foods/:id", authenticateToken, authorize("Food.Update"), upload.array("imgs", 2), updateFood)
router.delete("/foods/:id", authenticateToken, authorize("Food.Delete"), deleteFood)
router.get("/foods",  getFoods)

router.get("/getUser/:id", authenticateToken, authorize("User.View"), getUser)
router.get("/getUsers", authenticateToken, authorize("User.View"), getUsers)
router.get("/getPermissions", authenticateToken, authorize("User.View"), getPermissions)
router.get("/getAdminStats", authenticateToken, authorize("User.View"), getAdminStats)
router.get("/getRoles", authenticateToken, authorize("User.View"), getRoles)
router.put("/giveAproach/:id", authenticateToken, authorize("User.Update"), giveAproach)
router.put("/giveReject/:id", authenticateToken, authorize("User.Update"), giveReject)
router.delete("/deleteUser/:id", authenticateToken, authorize("User.Delete"), deleteUser)
router.put("/updatePermission/:id", authenticateToken, authorize("User.Update"), updatePermission)
router.put("/updateUser/:id", authenticateToken, authorize("User.Update"), updateUser)

router.get("/categories",  getCategories)
router.post("/categories", authenticateToken, authorize("Category.Create"), createCategory)
router.put("/categories/:id", authenticateToken, authorize("Category.Update"), updateCategory)
router.put("/categories/:id/reassign", authenticateToken, authorize("Category.Update"), reassign)
router.delete("/categories/:id", authenticateToken, authorize("Category.Delete"), deleteCategory)



module.exports = router;

