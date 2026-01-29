const { authenticateToken } = require('../middleware/auth');
const multer = require("multer");
const express = require('express');

const authorize = require("../middleware/authorize");
const router = express.Router();

const {  getUser,getRoles,getUsers,
  deleteUser,createUser,getAdminStats,
  updateUser
} = require('../controllers/userController');


router.post("/", authenticateToken, createUser)
router.get("/:id", authenticateToken, getUser)
router.get("/", authenticateToken, getUsers)
router.delete("/:id", authenticateToken, deleteUser)
router.put("/:id", authenticateToken, updateUser)



module.exports = router;
