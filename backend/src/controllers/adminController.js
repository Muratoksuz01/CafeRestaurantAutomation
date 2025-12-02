const User = require('../models/User');
const Foods = require('../models/foods');
const { saveImage, deleteImage } = require("../utils/saveImage");



// CREATE FOOD
const createFood = async (req, res) => {
  console.log("vdfv")
  console.log(req.body)
  try {
    const { name, price, description } = req.body;
    const imgs = req.files;
    console.log(imgs)
   // imgs.map(img => img.mv("/uploads/"+img.name))

    // if (!imgs || !Array.isArray(imgs) || imgs.length === 0 || imgs.length > 2) {
    //   return res.status(400).json({ success: false, message: "imgs 1-2 resim olmalı" });
    // }

    // Resimleri kaydet
   // const savedImages = imgs.map((img) => saveImage(img));

    // const food = await Foods.create({
    //   name,
    //   price,
    //   description,
    //   imgs: imgs
    // });

    res.json({ success: true, data: food });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



// UPDATE FOOD
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



// DELETE FOOD
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



const giveAproach = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.isActive = true;
    await user.save(); // güncelleme

    res.json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
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
 giveAproach
};