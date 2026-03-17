const mongoose = require("mongoose");

const TableLocationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
  
   
  },
  { timestamps: false }
);

module.exports = mongoose.model("TableLocations", TableLocationSchema);
