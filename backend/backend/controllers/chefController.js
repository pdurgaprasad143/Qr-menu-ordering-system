import Chef from "../models/chefModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc    Register a new chef
// @route   POST /api/chefs/register
export const registerChef = async (req, res) => {
  try {
    const { username, email, password, fullName, phone } = req.body;

    // Check if chef already exists
    const chefExists = await Chef.findOne({ email });
    if (chefExists) {
      return res.status(400).json({ message: "Chef already exists" });
    }

    // Create new chef (No password hashing)
    const chef = new Chef({
      username,
      email,
      password, // Stored as plain text
      fullName,
      phone,
    });

    // Save chef to database
    await chef.save();

    res.status(201).json({
      _id: chef._id,
      username: chef.username,
      email: chef.email,
      fullName: chef.fullName,
      phone: chef.phone,
      token: generateToken(chef._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Login chef & get token
// @route   POST /api/chefs/login
export const loginChef = async (req, res) => {
  try {
    const { email, password } = req.body;

    const chef = await Chef.findOne({ email });

    // Check if chef exists and password matches (No bcrypt, direct comparison)
    if (chef && chef.password === password) {
      res.json({
        _id: chef._id,
        username: chef.username,
        email: chef.email,
        fullName: chef.fullName,
        phone: chef.phone,
        token: generateToken(chef._id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get chef profile
// @route   GET /api/chefs/profile/:id
export const getChefProfile = async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.id).select("-password"); // Don't send password

    if (chef) {
      res.json(chef);
    } else {
      res.status(404).json({ message: "Chef not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update chef profile
// @route   PUT /api/chefs/profile/:id
export const updateChefProfile = async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.id);

    if (chef) {
      chef.username = req.body.username || chef.username;
      chef.fullName = req.body.fullName || chef.fullName;
      chef.phone = req.body.phone || chef.phone;
      chef.email = req.body.email || chef.email;

      // Directly update password (No hashing)
      if (req.body.password) {
        chef.password = req.body.password;
      }

      const updatedChef = await chef.save();

      res.json({
        _id: updatedChef._id,
        username: updatedChef.username,
        email: updatedChef.email,
        fullName: updatedChef.fullName,
        phone: updatedChef.phone,
        token: generateToken(updatedChef._id),
      });
    } else {
      res.status(404).json({ message: "Chef not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
