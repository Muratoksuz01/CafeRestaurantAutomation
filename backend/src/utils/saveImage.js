const fs = require("fs");
const path = require("path");

// base64 string'i assets/foods içine kaydet
const saveImage = (base64Data) => {
  try {
    const folderPath = path.join(__dirname, "..", "assets", "foods");

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.jpg`;

    const filePath = path.join(folderPath, fileName);

    // Base64 "data:image/jpeg;base64," kısmını temizle
    const base64Clean = base64Data.replace(/^data:.+;base64,/, "");

    fs.writeFileSync(filePath, base64Clean, { encoding: "base64" });

    return `foods/${fileName}`;
  } catch (err) {
    console.error("Image save error:", err);
    return null;
  }
};


// Dosya sil
const deleteImage = (relativePath) => {
  try {
    const fullPath = path.join(__dirname, "..", "assets", relativePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (err) {
    console.error("Image delete error:", err);
  }
};

module.exports = { saveImage, deleteImage };
