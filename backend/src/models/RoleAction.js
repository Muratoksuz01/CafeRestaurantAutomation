const mongoose = require("mongoose");

const RoleActionSchema = new mongoose.Schema(
  {
     roleId: { 
                type: mongoose.Schema.Types.ObjectId,
                ref: "Roles",
                required: false
              },
    actionId: { 
                type: mongoose.Schema.Types.ObjectId,
                ref: "Actions",
                required: false
              },
             
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoleActions", RoleActionSchema);
