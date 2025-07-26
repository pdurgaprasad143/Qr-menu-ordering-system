import Category from "../models/category.js";

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });
    }

    const newCategory = new Category({ name });
    await newCategory.save();

    res
      .status(201)
      .json({
        success: true,
        message: "Category created successfully",
        category: newCategory,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    res.status(200).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedCategory)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    res
      .status(200)
      .json({
        success: true,
        message: "Category updated successfully",
        category: updatedCategory,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    await Category.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
