const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const multer = require("multer");
const authorize = require("../middleware/authorize");
const router = express.Router();
const { 
  createFood,updateFood,
  getFoods,deleteFood, 
} = require("../controllers/foodController")
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getFoods)
router.put("/:id", authenticateToken, upload.array("imgs", 2),authorize("Yonetici"), updateFood)
router.post("/", authenticateToken, upload.array("imgs", 2),authorize("Yonetici"), createFood)
router.delete("/:id", authenticateToken,authorize("Yonetici"), deleteFood)




module.exports = router;
