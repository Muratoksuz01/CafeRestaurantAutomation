const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const authorize = require("../middleware/authorize");

const {getTables,getTable,editTable,deleteTable, createTable, createOrder,editOrder,deleteOrder,getPaid,reassignTables,} =require("../controllers/user/userController")
router.get("/getTables", authenticateToken, getTables);
router.get('/getTable', authenticateToken, getTable);
router.delete('/deleteTable/:id', authenticateToken, deleteTable);
router.put('/editTable/:id', authenticateToken, editTable);
router.post("/createTable", authenticateToken, createTable);
router.post("/createOrder", authenticateToken, createOrder);

router.post("/editOrder", authenticateToken, editOrder);
router.delete("/deleteOrder", authenticateToken,authorize("Kasiyer"), deleteOrder);
router.post("/paidOrder", authenticateToken,authorize("Kasiyer"), getPaid);
router.put('/reassign', authenticateToken, reassignTables);
// router.put("/book/:id", book);


module.exports = router;
