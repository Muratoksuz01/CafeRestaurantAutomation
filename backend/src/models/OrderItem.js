const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
    { 
        foodId:{type:mongoose.Schema.Types.ObjectId,ref:"Foods",required:true},
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        
        qty:{type: Number, required: true},
        unitprice: { type: Number, required: true }, // o anki o yemegin fiyatı 
        total: { type: Number, required: true }, // o anki o yemegin fiyatı 
        

    },
    { timestamps: true }
);

module.exports = mongoose.model("OrderItems", OrderItemSchema);
