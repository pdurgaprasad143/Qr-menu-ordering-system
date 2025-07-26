import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, default: "" },
    isBooking: { type: Boolean, default: false },
    bookingDetails: {
      date: { type: Date },
      time: { type: String },
      numberOfPeople: { type: Number, min: 1, max: 10 },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "canceled"],
      default: "pending",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
