const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const authorize = require("../middleware/authorize");

const {getTables,getTable,editTable,deleteTable, createTable, createOrder,editOrder,deleteOrder,getPaid,reassignTables, book,getPermissions,} =require("../controllers/user/userController")
router.get("/getTables",authenticateToken,authorize("Table.View"),getTables);
router.get('/getTable',authenticateToken,getTable );
router.delete('/deleteTable/:id',authenticateToken,authorize("Table.Delete"),deleteTable );
router.put('/editTable/:id',authenticateToken,authorize("Table.Update"),editTable );
router.post("/createTable",authenticateToken,authorize("Table.Create"),createTable)
router.post("/createOrder",authenticateToken,authorize("Order.Create"),createOrder)

router.post("/editOrder",authenticateToken,authorize("Order.Update"),editOrder)
router.delete("/deleteOrder",authenticateToken,authorize("Order.Delete"),deleteOrder)
router.post("/paidOrder",authenticateToken,authorize("Order.Paid"),getPaid)
router.put('/reassign',authenticateToken,authorize("Table.Update"),reassignTables );
router.put("/book/:id",authorize("Table.Update"),book)


module.exports = router;
