import Order from "../models/order.js";

export const createOrder = async (req, res) => {
  try {
    const { tableNumber, items, totalCost, paymentDetails } = req.body;

    if (
      !tableNumber ||
      !items ||
      items.length === 0 ||
      !totalCost ||
      !paymentDetails
    ) {
      console.log("❌ Missing required fields in request body");
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const newOrder = new Order({
      tableNumber,
      items,
      totalCost,
      status: "Pending",
      paymentDetails: {
        cardNumberLast4: paymentDetails.cardNumber.slice(-4), // Store only last 4 digits
        transactionId: paymentDetails.transactionId,
        paymentMethod: paymentDetails.paymentMethod,
        paymentStatus: paymentDetails.paymentStatus || "Pending",
      },
    });

    await newOrder.save();

    console.log("✅ Order created successfully:", newOrder);

    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error("❌ Error creating order:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { cardNumber, transactionId } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentDetails: {
          cardNumber: cardNumber.slice(-4), // Store only last 4 digits
          transactionId,
          paymentStatus: "Success",
        },
      },
      { new: true }
    );

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderStatus = async (req, res) => {
  try {
    const { tableNumber } = req.query; // Get tableNumber from query params

    if (!tableNumber) {
      return res
        .status(400)
        .json({ success: false, message: "Table number is required" });
    }

    // 🔹 Fetch the latest order for the given table number
    const order = await Order.findOne({ tableNumber }).sort({ createdAt: -1 });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found for this table" });
    }

    res.json({ success: true, status: order.status });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // Fetch all orders, latest first

    if (!orders.length) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found" });
    }

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrdersByStatus = async (req, res) => {
  try {
    const { status = "Pending" } = req.params; // Default to "Pending" if no status is provided

    const orders = await Order.find({ status }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "Pending",
      "Preparing",
      "Ready",
      "Completed",
      "Rejected",
    ];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
