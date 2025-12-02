const { Router } = require('express');
const userRoutes = require('./userRoutes');
const adminRoutes =require("./adminRoute")

const router = Router();

// User routes
router.use('/users', userRoutes);
router.use("/admin",adminRoutes )

module.exports = router;


