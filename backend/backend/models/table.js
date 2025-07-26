import mongoose from "mongoose";
import QRCode from "qrcode";

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  capacity: {
    type: Number, // Optional field
  },
  qrCode: {
    type: String, // Stores the QR Code URL
  },
});

// Generate QR Code before saving or updating table
tableSchema.pre("save", async function (next) {
  try {
    // Use local network IP to allow access from other devices
    const qrData = `http://192.168.0.106:5173/menu`; // Redirects to menu page

    // Only update QR Code if it's a new document or tableNumber has changed
    if (!this.qrCode || this.isModified("tableNumber")) {
      this.qrCode = await QRCode.toDataURL(qrData);
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Table = mongoose.model("Table", tableSchema);
export default Table;
