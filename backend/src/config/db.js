// db.js
const mongoose = require("mongoose");

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB bağlantısı başarılı");
  } catch (err) {
    console.error("MongoDB bağlantı hatası:", err);
    process.exit(1);
  }
}

module.exports = connectToDatabase;


module.exports = { connectToDatabase };
