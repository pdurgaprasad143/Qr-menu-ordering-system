import express from "express";
import {
  createDish,
  getAllDishes,
  getChefDishes,
  getDishesByCategory, // ✅ New route for fetching by category
  getDishById,
  updateDish,
  deleteDish,
} from "../controllers/dishController.js";

const router = express.Router();

// Routes
router.post("/", createDish); // Create a dish
router.get("/", getAllDishes); // Get all dishes
router.get("/chef/:chefId", getChefDishes); // Get dishes by a specific chef
router.get("/category/:categoryId", getDishesByCategory); // ✅ Get dishes by category
router.get("/:id", getDishById); // Get a single dish by ID
router.put("/:id", updateDish); // Update a dish
router.delete("/:id", deleteDish); // Delete a dish

export default router;
