const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const authorize = require("../middleware/authorize");

const {createOrder,deleteOrder,updateOrder,
    editOrder,getOrder,getOrders,getPaid,getOrdersByDate,
} =require("../controllers/orderController")


router.post("/createOrder", authenticateToken, createOrder);
router.post("/getOrders/by-date",  getOrdersByDate);
router.get("/getOrders", authenticateToken, getOrders);
router.get("/getOrder/:id", authenticateToken, getOrder);
router.get("/updateOrder/:id", authenticateToken, updateOrder);
router.post("/editOrder", authenticateToken, editOrder);
router.delete("/deleteOrder", authenticateToken,authorize("Kasiyer"), deleteOrder);
router.post("/paidOrder", authenticateToken,authorize("Kasiyer"), getPaid);


module.exports = router;