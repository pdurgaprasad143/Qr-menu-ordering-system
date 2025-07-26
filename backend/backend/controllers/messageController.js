import Message from "../models/Message.js";

// @desc   Create a new message
// @route  POST /api/messages
// @access Public
export const createMessage = async (req, res) => {
  try {
    const { name, email, phone, message, isBooking, bookingDetails } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // If it's a booking, validate booking details
    if (isBooking) {
      if (
        !bookingDetails?.date ||
        !bookingDetails?.time ||
        !bookingDetails?.numberOfPeople
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Incomplete booking details" });
      }
    }

    // Create new message document
        // Create new message document
        // Create new message document
        const newMessage = new Message({
          name,
          email,
          phone,
          message,
          isBooking,
          bookingDetails: isBooking ? bookingDetails : null,
          status: isBooking ? "pending" : undefined, // Changed from "confirmed" to "pending"
        });

    // Save to database
    await newMessage.save();

    res.status(201).json({
      success: true,
      message: "Message submitted successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc   Get all messages (with optional filter by booking status)
// @route  GET /api/messages
// @route  GET /api/messages?status=pending
// @access Public
export const getMessages = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status) {
      filter.status = status;
    }

    const messages = await Message.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc   Get a single message by ID
// @route  GET /api/messages/:id
// @access Public
export const getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    res.status(200).json({ success: true, data: message });
  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc   Update message status (for booking messages)
// @route  PUT /api/messages/:id/status
// @access Public
export const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "canceled"];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedMessage) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    res.status(200).json({
      success: true,
      message: "Message status updated",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc   Delete a message
// @route  DELETE /api/messages/:id
// @access Public
export const deleteMessage = async (req, res) => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(req.params.id);

    if (!deletedMessage) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
