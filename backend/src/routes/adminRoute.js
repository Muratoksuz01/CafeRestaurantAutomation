const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const authorize = require("../middleware/authorize");

const router = express.Router();
const { getAdminStats} =require("../controllers/userController")


router.get("/getAdminStats", authenticateToken,authorize("Yonetici"), getAdminStats)




module.exports = router;

