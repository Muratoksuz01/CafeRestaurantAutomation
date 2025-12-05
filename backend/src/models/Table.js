const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    status: { type: String,enum:["bos","dolu"], required: true},
    currentOrderId:  { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orders",
        required: false
      }
    , 
  },
  { timestamps: false }
);

module.exports = mongoose.model("Tables", TableSchema);
