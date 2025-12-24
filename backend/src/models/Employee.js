const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employees", EmployeeSchema);
