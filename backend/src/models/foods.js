const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true }, // sayı
    description: { type: String, required: true, trim: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",   // İlişki kurulacak model adı
      required: true,
    
    },
    imgs: {
      type: [String],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length <= 2 && v.length != 0;
        },
        message: "imgs alanı tam olarak 2 elemanlı bir string dizisi olmalıdır."
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Foods", FoodSchema);
