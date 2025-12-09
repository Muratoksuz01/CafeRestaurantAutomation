// db.js
const mongoose = require("mongoose");

async function connectToDatabase() {
  try {
    // connect işlemi
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB bağlantısı başarılı");

  } catch (err) {
    // Özel hata kontrolü (querySrv ETIMEOUT)
    if (err.code === 'ETIMEOUT' && err.syscall === 'querySrv') {
      console.error("❌ DNS ZAMAN AŞIMI HATASI (ETIMEOUT):");
      console.error("MongoDB sunucusuna erişilemiyor. Lütfen şunları kontrol edin:");
      console.error("1. İnternet bağlantınızın aktif olduğundan emin olun.");
      console.error("2. Şirket/Okul ağındaysanız güvenlik duvarı (firewall) bağlantıyı engelliyor olabilir.");
      console.error("3. DNS ayarlarınızın doğru yapılandırıldığından emin olun.");
    } else {
      // Diğer tüm hatalar için standart log
      console.error("MongoDB bağlantı hatası:", err);
    }
    
    process.exit(1);
  }
}

// Not: Orijinal kodda iki kere export vardı, doğrusu tek olmalıdır.
module.exports = {connectToDatabase};