import express from "express";
import {
  createMessage,
  getMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage,
} from "../controllers/messageController.js";

const router = express.Router();

// Create a new message
router.post("/", createMessage);

// Get all messages (with optional status filter)
router.get("/", getMessages);

// Get a single message by ID
router.get("/:id", getMessageById);

// Update message status (for bookings)
router.put("/:id/status", updateMessageStatus);

// Delete a message
router.delete("/:id", deleteMessage);

export default router;