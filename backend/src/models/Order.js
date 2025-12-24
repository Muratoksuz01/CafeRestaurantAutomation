const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    tableId:{type:mongoose.Schema.Types.ObjectId,
      ref:"Tables",
      required:true
    },
    total: { type: Number, required: true }, //  
    status:{type:String ,enum:["hazirlaniyor","tamamlandi","iptal edildi"] ,required:true},//sipariş tamamlandı mı odeme alındııgnda true olacak 
    orderItems:[{
      type:mongoose.Schema.Types.ObjectId,ref:"OrderItems",required:false
    } ],
    waiterId: {   // siparişi alan garson
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
     //   required: true
      },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders", OrderSchema);
