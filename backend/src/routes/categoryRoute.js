const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const multer = require("multer");
const authorize = require("../middleware/authorize");
const router = express.Router();

const {
  reassign,createCategory,
  updateCategory,deleteCategory,
  getCategories, } = require("../controllers/categoryController")

router.get("/", getCategories)
router.post("/", authenticateToken,authorize("Yonetici"), createCategory)
router.put("/:id", authenticateToken,authorize("Yonetici"), updateCategory)
router.put("/:id/reassign", authenticateToken,authorize("Yonetici"), reassign)
router.delete("/:id", authenticateToken,authorize("Yonetici"), deleteCategory)

module.exports = router;
