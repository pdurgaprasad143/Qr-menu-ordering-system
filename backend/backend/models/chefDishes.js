import mongoose from "mongoose";

const dishSchema = new mongoose.Schema({
  chef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chef", // Reference to the Chef model
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId, // Fix: Use ObjectId
    ref: "Category", // Fix: Reference the Category model
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  imageUrl: {
    type: String, // URL of dish image
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Dish = mongoose.model("Dish", dishSchema);

export default Dish;
