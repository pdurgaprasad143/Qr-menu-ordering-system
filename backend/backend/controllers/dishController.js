import Dish from "../models/chefDishes.js";
import Category from "../models/category.js";

// Create a new dish
export const createDish = async (req, res) => {
  try {
    const { chef, name, description, category, price, imageUrl } = req.body;

    // Validate category
    if (!category || !chef) {
      return res
        .status(400)
        .json({ success: false, message: "Chef and category are required." });
    }

    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category" });
    }

    const newDish = new Dish({
      chef, // Chef ID should be provided in the request body
      name,
      description,
      category,
      price,
      imageUrl,
    });

    await newDish.save();
    res.status(201).json({
      success: true,
      message: "Dish created successfully",
      dish: newDish,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all dishes
export const getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find()
      .populate("chef", "username email")
      .populate("category", "name");

    res.status(200).json({ success: true, dishes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get dishes by a specific category
export const getDishesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category" });
    }

    const dishes = await Dish.find({ category: categoryId }).populate(
      "chef",
      "username email"
    );
    res.status(200).json({ success: true, dishes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get dishes by a specific chef
export const getChefDishes = async (req, res) => {
  try {
    const { chefId } = req.params;
    const dishes = await Dish.find({ chef: chefId }).populate(
      "category",
      "name"
    );

    res.status(200).json({ success: true, dishes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single dish by ID
export const getDishById = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id)
      .populate("chef", "username email")
      .populate("category", "name");

    if (!dish) {
      return res
        .status(404)
        .json({ success: false, message: "Dish not found" });
    }

    res.status(200).json({ success: true, dish });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a dish
export const updateDish = async (req, res) => {
  try {
    const { category } = req.body;

    // If updating category, check if it exists
    if (category) {
      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid category" });
      }
    }

    const updatedDish = await Dish.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("category", "name");

    if (!updatedDish) {
      return res
        .status(404)
        .json({ success: false, message: "Dish not found" });
    }

    res.status(200).json({
      success: true,
      message: "Dish updated successfully",
      dish: updatedDish,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a dish
export const deleteDish = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);

    if (!dish) {
      return res
        .status(404)
        .json({ success: false, message: "Dish not found" });
    }

    await Dish.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Dish deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
