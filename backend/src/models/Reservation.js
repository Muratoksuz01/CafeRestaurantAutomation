const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employees",
      required: true
    },
    untilTime: { type: Date, required: true, trim: true },
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tables",
      required: true
    },
    isComplete: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("reservations", ReservationSchema);
