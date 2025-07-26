import Table from "../models/table.js";
import QRCode from "qrcode";

// ✅ Create a new table with QR Code
export const createTable = async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;

    // Check if table already exists
    const existingTable = await Table.findOne({ tableNumber });
    if (existingTable) {
      return res
        .status(400)
        .json({ success: false, message: "Table already exists" });
    }

    // Generate QR Code with the table URL
    const qrData = `https://yourwebsite.com/menu/${tableNumber}`;
    const qrCode = await QRCode.toDataURL(qrData);

    // Create a new table
    const newTable = new Table({ tableNumber, capacity, qrCode });
    await newTable.save();

    res.status(201).json({
      success: true,
      message: "Table created successfully",
      table: newTable,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all tables
export const getAllTables = async (req, res) => {
  try {
    const tables = await Table.find();
    res.status(200).json({ success: true, tables });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get a single table by ID
export const getTableById = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res
        .status(404)
        .json({ success: false, message: "Table not found" });
    }
    res.status(200).json({ success: true, table });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update a table (Regenerate QR if tableNumber changes)
export const updateTable = async (req, res) => {
  try {
    const { tableNumber } = req.body;
    let updatedTable = await Table.findById(req.params.id);

    if (!updatedTable) {
      return res
        .status(404)
        .json({ success: false, message: "Table not found" });
    }

    // If tableNumber changes, regenerate QR Code
    if (tableNumber && tableNumber !== updatedTable.tableNumber) {
      const qrData = `https://yourwebsite.com/menu/${tableNumber}`;
      req.body.qrCode = await QRCode.toDataURL(qrData);
    }

    updatedTable = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Table updated successfully",
      table: updatedTable,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete a table
export const deleteTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res
        .status(404)
        .json({ success: false, message: "Table not found" });
    }

    await Table.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Table deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
