const mongoose = require("mongoose");

const UserRoleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: false
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roles",
      required: false
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserRoles", UserRoleSchema);
