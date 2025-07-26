import mongoose from "mongoose";

const chefSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String, // Stored in plain text (⚠️ Not recommended for production)
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["chef"],
    default: "chef",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Remove bcrypt logic (No password hashing)

// No password comparison function (since passwords are stored in plain text)

const Chef = mongoose.model("Chef", chefSchema);

export default Chef;
