const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
    { /**
        burası odeme alındıktan sonra tempOrderItem dan o masaya ait kısım silenecek buraya eklenecek
        burası sadece odemesi alınan siparişler icin 
        */
        name: { type: String, required: true, trim: true },
        foodId:{type:mongoose.Schema.Types.ObjectId,ref:"Foods",required:true},
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        qty:{type: Number, required: true},
        price: { type: Number, required: true }, // o anki o yemegin fiyatı 
        // isClosed: { type: Boolean, default: false } 

    },
    { timestamps: true }
);

module.exports = mongoose.model("OrderItems", OrderItemSchema);
