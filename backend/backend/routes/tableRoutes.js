import express from "express";
import {
  createTable,
  getAllTables,
  getTableById,
  updateTable,
  deleteTable,
} from "../controllers/tableController.js";

const router = express.Router();

// ✅ Routes for table management
router.post("/tables", createTable); // Create a new table
router.get("/tables", getAllTables); // Get all tables
router.get("/tables/:id", getTableById); // Get a specific table
router.put("/tables/:id", updateTable); // Update a table
router.delete("/tables/:id", deleteTable); // Delete a table

export default router;
