const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const authorize = require("../middleware/authorize");

const {getTables,getTable,editTable,deleteTable,reassignTables,createTable
 } =require("../controllers/tableController")

const {createOrder,deleteOrder,updateOrder,
    editOrder,getOrder,getOrders,getPaid,getOrdersByDate,
} =require("../controllers/orderController")

router.get("/getTables", authenticateToken, getTables);
router.get('/getTable', authenticateToken, getTable);
router.delete('/deleteTable/:id', authenticateToken, deleteTable);
router.put('/editTable/:id', authenticateToken, editTable);
router.post("/createTable", authenticateToken, createTable);
router.put('/reassign', authenticateToken, reassignTables);

router.post("/createOrder", authenticateToken, createOrder);
router.post("/getOrders/by-date",  getOrdersByDate);
router.get("/getOrders", authenticateToken, getOrders);
router.get("/getOrder/:id", authenticateToken, getOrder);
router.get("/updateOrder/:id", authenticateToken, updateOrder);
router.post("/editOrder", authenticateToken, editOrder);
router.delete("/deleteOrder", authenticateToken, deleteOrder);
router.post("/paidOrder", authenticateToken, getPaid);
// router.put("/book/:id", book);
//getOrders/by-date

module.exports = router;
