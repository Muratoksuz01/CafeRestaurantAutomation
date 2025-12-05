const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    orderId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order",
                required: true,
            },
    paymentType: { type: String, enum:["cart","nakit"], required: true,},
    total: { type: Number, required: true }, // sayı

   
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payments", PaymentSchema);
