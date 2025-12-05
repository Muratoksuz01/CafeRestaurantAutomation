const fs = require("fs");
const path = require("path");

// base64 string'i assets/foods içine kaydet
const saveLocalImage = (file) => {
  const ext = path.extname(file.originalname);
  const base = path.basename(file.originalname, ext);
  const filename = `${base}-${Date.now()}${ext}`;
  const filePath = path.join("assets/foods", filename);

  fs.writeFileSync(filePath, file.buffer); // memory’den yazıyoruz

  return `/assets/foods/${filename}`;
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

module.exports = { saveLocalImage, deleteImage };
