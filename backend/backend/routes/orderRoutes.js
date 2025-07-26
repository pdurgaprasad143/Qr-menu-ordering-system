import express from "express";
import {
  createOrder,
  updatePayment,
  getOrderStatus,
  getAllOrders,
  getOrdersByStatus,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder); // Create order
router.patch("/:orderId/payment", updatePayment); // Update payment status
router.get("/:orderId/status", getOrderStatus); // Track order

router.get("/orders", getAllOrders); // Route to fetch all orders for the chef
router.get("/status", getOrderStatus); // Get latest order status by table number
router.get("/orders/status/:status", getOrdersByStatus); // ✅ Fixed params issue
router.put("/orders/update/:orderId", updateOrderStatus); // ✅ Update order status
export default router;
