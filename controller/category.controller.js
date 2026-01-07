const Category = require("../models/catetory.model");

/**
 * ➕ Create Category
 */
exports.createCategory = async (req, res) => {
  try {
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    // check duplicate
    const exists = await Category.findOne({ category });
    if (exists) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const newCategory = await Category.create({ category });

    res.status(201).json({
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 📥 Get All Categories
 */
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ✏ Update Category
 */
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;

    const updated = await Category.findByIdAndUpdate(
      id,
      { category },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ❌ Delete Category
 */
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
