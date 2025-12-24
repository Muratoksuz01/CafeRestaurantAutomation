const Foods = require('../models/foods');
const Category = require("../models/Category");


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

module.exports = {
 
  reassign,
 
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
};