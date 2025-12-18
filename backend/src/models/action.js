const mongoose = require("mongoose");

const ActionSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, trim: true },
    description:{ type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Actions", ActionSchema);
