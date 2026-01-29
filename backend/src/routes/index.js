const { Router } = require('express');
const adminRoutes =require("./adminRoute")
const authRoutes =require("./authRoute")
const orderRoutes =require("./orderRoute")
const tableRoutes =require("./TableRoute")
const foodRoutes =require("./foodRoute")
const userRoutes =require("./userRoute")
const categoryRoutes =require("./categoryRoute")
const authorize = require("../middleware/authorize");

const router = Router();

// User routes
router.use("/admin", adminRoutes )
router.use("/auth",authRoutes )
router.use('/order', orderRoutes);
router.use('/table', tableRoutes);
router.use('/food', foodRoutes);
router.use('/user', userRoutes);
router.use('/category', categoryRoutes);

module.exports = router;


