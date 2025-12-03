const User = require('../models/User');
const Foods = require('../models/foods');
const Category =require( "../models/Category");

const { saveImage, deleteImage } = require("../utils/saveImage");

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


const createFood = async (req, res) => {
  console.log("geldi")
  try {
    const { name, price, description,categoryId} = req.body;
    const files = req.files; // multer files
console.log(categoryId)
   if (!files || !Array.isArray(files) || files.length < 1 || files.length > 2) {
  return res.status(400).json({ success: false, message: "1 veya 2 resim seçilmelidir" });
}

    const imgs = files.map((file) => `/assets/foods/${file.filename}`);

    const food = await Foods.create({
      name,
      price,
      description,
      categoryId,
      imgs,
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
    const { name, price, description, imgs } = req.body;
    const current = await Foods.findById(id);
    if (!current)
      return res.status(404).json({ success: false, message: "Food not found" });
    // Eski resimleri sil
    current.imgs.forEach((img) => deleteImage(img));
    // Yeni resimleri kaydet
    const savedImages = imgs.map((img) => saveImage(img));
    const updated = await Foods.findByIdAndUpdate(
      id,
      {
        name,
        price,
        description,
        imgs: savedImages
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
const getFoods =async (req,res) => {
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
 deleteUser,
 giveReject,
 getFoods,
 createCategory,
 updateCategory,
 deleteCategory,
 getCategories,
};