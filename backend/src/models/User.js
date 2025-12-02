const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Şema
const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    phoneNumber: { type: String },
    isActive: { type: Boolean, default: null },
    role: { type: String, enum: ["admin", "user"], default: "user" },
   
  },
  { timestamps: true }
);

// Şifre hash
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Şifre doğrulama
UserSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
