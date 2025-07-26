import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: true,
  },
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalCost: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Preparing", "Ready", "Completed", "Rejected"],
    default: "Pending",
  },
  paymentDetails: {
    cardNumberLast4: { type: String, required: true }, // Only store last 4 digits for security
    transactionId: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ["Card", "UPI", "Cash"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
    },
    paymentDate: { type: Date, default: Date.now },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Order", orderSchema);
