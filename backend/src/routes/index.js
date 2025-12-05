const { Router } = require('express');
const userRoutes = require('./userRoutes');
const adminRoutes =require("./adminRoute")
const authRoutes =require("./authRoute")

const router = Router();

// User routes
router.use("/admin",adminRoutes )
router.use("/auth",authRoutes )
router.use('/user', userRoutes);

module.exports = router;


