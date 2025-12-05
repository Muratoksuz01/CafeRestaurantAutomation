const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {getTables,getTable,editTable,deleteTable, createTable, createOrder} =require("../controllers/user/userController")
router.get('/getTables',getTables );
router.get('/getTable',getTable );
router.delete('/deleteTable/:id',deleteTable );
router.put('/editTable/:id',editTable );
router.post("/createTable",createTable)
router.post("/createOrder",createOrder)

module.exports = router;
