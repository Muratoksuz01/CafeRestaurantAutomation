const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    tableId:{type:mongoose.Schema.Types.ObjectId,
      ref:"Table",
      required:true
    },
    total: { type: Number, required: true }, //  
    isClosed:{type:Boolean,required:true},//sipariş tamamlandı mı odeme alındııgnda true olacak 
    orderItems:[{
      type:mongoose.Schema.Types.ObjectId,ref:"OrderItems",required:false
    } ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders", OrderSchema);
