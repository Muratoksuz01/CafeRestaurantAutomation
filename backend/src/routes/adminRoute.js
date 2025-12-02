const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
getUsers,
 createFood,
 deleteFood,
giveAproach,
 updateFood
} = require('../controllers/adminController');
const multer = require("multer");
const path = require("path");

// Kayıt dizini ve filename ayarı
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "assets/foods"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = file.fieldname + "-" + Date.now() + ext;
    cb(null, name);
  }
});
const upload = multer({ storage });
router.put("/giveAproach/:id",authenticateToken,giveAproach)
router.get('/getUsers',authenticateToken, getUsers);
router.post('/food',authenticateToken,  upload.array("imgs", 2),createFood);
router.delete('/food/:id',authenticateToken, deleteFood);
router.put('/food/:id',authenticateToken, updateFood);



module.exports = router;

