import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

// Category Routes
router.post("/", createCategory); // Create a new category
router.get("/", getAllCategories); // Get all categories
router.get("/:id", getCategoryById); // Get a category by ID
router.put("/:id", updateCategory); // Update a category
router.delete("/:id", deleteCategory); // Delete a category

export default router;
