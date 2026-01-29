const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

const {getTables,getTable,editTable,deleteTable,reassignTables,createTable
 } =require("../controllers/tableController")


router.get("/", authenticateToken, getTables);
router.get('/:id', authenticateToken, getTable);
router.delete('/:id', authenticateToken, deleteTable);
router.put('/:id', authenticateToken, editTable);
router.post("/", authenticateToken, createTable);
router.put('/reassign', authenticateToken, reassignTables);



module.exports = router;