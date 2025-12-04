const User = require('../models/User');
const Foods = require('../models/foods');
const Category = require("../models/Category");
const fs = require("fs");
const path = require("path");

const { saveImage, deleteImage } = require("../utils/saveImage");

const saveLocalImage = (file) => {
  const ext = path.extname(file.originalname);
  const base = path.basename(file.originalname, ext);
  const filename = `${base}-${Date.now()}${ext}`;
  const filePath = path.join("assets/foods", filename);

  fs.writeFileSync(filePath, file.buffer); // memory’den yazıyoruz

  return `/assets/foods/${filename}`;
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const createCategory = async (req, res) => {
  try {
    const category = await Category.create({ name: req.body.name });
    res.json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    if (!category) return res.status(404).json({ success: false, message: "Kategori bulunamadı" });
    res.json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Kategori bulunamadı" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const reassign =async (req, res) => {
  const { newCategoryId } = req.body;
  await Foods.updateMany({ categoryId: req.params.id }, { categoryId: newCategoryId });
  res.json({ success: true });
}


const createFood = async (req, res) => {
  console.log("geldi")
  try {
    const { name, price, description, categoryId } = req.body;
    const files = req.files; // multer files
    console.log(categoryId)
    if (!files || !Array.isArray(files) || files.length < 1 || files.length > 2) {
      return res.status(400).json({ success: false, message: "1 veya 2 resim seçilmelidir" });
    }

 
      newImgs = files.map(file => saveLocalImage(file));
    




    const food = await Foods.create({
      name,
      price,
      description,
      categoryId,
      imgs:newImgs,
    });

    res.json({ success: true, data: food });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const updateFood = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, price, description, categoryId } = req.body;
    const files = req.files; // multer files

    const food = await Foods.findById(id);
    if (!food) return res.status(404).json({ success: false, message: "Food not found" });

    let newImgs = food.imgs; // default olarak eski resimler

    // Yeni resim geldiyse işleme al
    if (files && files.length > 0) {
      // Eski resimleri sil
      for (const img of food.imgs) {
        try {// burası resimler senkron bir sekilde silmek icin var 
          fs.unlinkSync(path.join(".", img)); // ./assets/foods/img.jpg  
        } catch (e) { }
      }

      // Yeni resimleri kaydet
      newImgs = files.map(file => saveLocalImage(file));
    }

    const updated = await Foods.findByIdAndUpdate(
      id,
      {
        name,
        price,
        description,
        categoryId,
        imgs:newImgs
      },
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const deleteFood = async (req, res) => {
  try {
    const id = req.params.id;

    const current = await Foods.findById(id);

    if (!current)
      return res.status(404).json({ success: false, message: "Food not found" });

    // Resimleri sil
    current.imgs.forEach((img) => deleteImage(img));

    // Veriyi sil
    await Foods.findByIdAndDelete(id);

    res.json({ success: true, message: "Food deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const getFoods = async (req, res) => {
  try {
    const foods = await Foods.find();
    res.json({ success: true, data: foods });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
}



const giveAproach = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  user.isActive = true;
  await user.save();

  return res.json({ success: true, message: "User approved" });
};
const giveReject = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  user.isActive = false;
  await user.save();

  return res.json({ success: true, message: "User rejected" });
};
const deleteUser = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  await User.findByIdAndDelete(id);

  return res.json({ success: true, message: "User deleted" });
};
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ isActive: { $in: [false, null] } });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
module.exports = {
  getUsers,
  createFood,
  deleteFood,
  updateFood,
  giveAproach,
  reassign,
  deleteUser,
  giveReject,
  getFoods,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
};