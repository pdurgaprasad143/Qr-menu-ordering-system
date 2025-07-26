import React, { useState, useEffect } from "react";
import { Table, XCircle, CreditCard, ChefHat, CheckCircle } from "lucide-react";

const OrderCard = ({ order, handleStatusUpdate }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-50 border-yellow-500 text-yellow-700";
      case "Preparing":
        return "bg-blue-50 border-blue-500 text-blue-700";
      case "Ready":
        return "bg-green-50 border-green-500 text-green-700";
      case "Completed":
        return "bg-gray-50 border-gray-500 text-gray-700";
      case "Rejected":
        return "bg-red-50 border-red-500 text-red-700";
      default:
        return "bg-gray-100 border-gray-500 text-gray-700";
    }
  };

  return (
    <div className={`border-l-4 p-5 mb-4 rounded-lg shadow-md ${getStatusColor(order.status)}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-lg font-semibold">Order {order._id.slice(-4)}</h4>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="flex items-center bg-white px-2 py-1 rounded border border-gray-300">
              <Table className="h-4 w-4 text-gray-500 mr-1" />
              <span>Table {order.tableNumber || "N/A"}</span>
            </div>
            <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
          </div>
        </div>
        <span className="text-lg font-bold">₹{order.totalCost.toFixed(2)}</span>
      </div>
      <div className="space-y-2 mb-4 text-sm text-gray-700">
        {order.items?.map((item, index) => (
          <div key={`${item._id}-${index}`} className="flex justify-between">
            <span>{item.quantity}x {item.name}</span>
            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-2 text-sm">
        <span className={`px-3 py-1 rounded-full text-white font-medium ${order.paymentDetails.paymentStatus === "Success" ? "bg-green-500" : "bg-yellow-500"}`}>
          <CreditCard className="h-4 w-4 inline-block mr-1" />
          {order.paymentDetails.paymentStatus === "Success" ? "Paid" : "Pending"}
        </span>
        {order.status === "Rejected" && (
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium flex items-center">
            <XCircle className="h-4 w-4 mr-1" /> Cancelled
          </span>
        )}
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        {order.status === "Pending" && (
          <>
            <button onClick={() => handleStatusUpdate(order._id, "Rejected")}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center">
              <XCircle className="h-4 w-4 mr-2" /> Reject
            </button>
            <button onClick={() => handleStatusUpdate(order._id, "Preparing")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center">
              <ChefHat className="h-4 w-4 mr-2" /> Start Preparing
            </button>
          </>
        )}
        {order.status === "Preparing" && (
          <button onClick={() => handleStatusUpdate(order._id, "Ready")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" /> Mark Ready
          </button>
        )}
        {order.status === "Ready" && (
          <button onClick={() => handleStatusUpdate(order._id, "Completed")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" /> Complete
          </button>
        )}
      </div>
    </div>
  );
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("Pending");
  const [backendUrl, setBackendUrl] = useState("");

  useEffect(() => {
    const fetchBackendIP = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/ip");
        if (!response.ok) throw new Error("Failed to fetch backend IP");
        const data = await response.json();
        setBackendUrl(`http://${data.ip}:5000/api/orders/orders`);
      } catch (err) {
        setBackendUrl(`http://${window.location.hostname}:5000/api/orders`);
      }
    };

    fetchBackendIP();
  }, []);

  useEffect(() => {
    if (backendUrl) fetchOrders();
  }, [filter, backendUrl]);

  const fetchOrders = async () => {
    try {
      const url = `${backendUrl}/status/${filter}`;
      console.log("Fetching orders from:", url);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      if (data.success) setOrders(data.orders);
      else console.error("Failed to fetch orders:", data.message);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(`${backendUrl}/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      if (data.success) fetchOrders();
      else console.error("Failed to update order status:", data.message);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Orders</h2>
      <div className="flex space-x-4 mb-4">
        {["Pending", "Preparing", "Ready", "Completed", "Rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md ${filter === status ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
          >
            {status}
          </button>
        ))}
      </div>
      {orders.length > 0 ? orders.map((order) => <OrderCard key={order._id} order={order} handleStatusUpdate={handleStatusUpdate} />) : <p className="text-gray-600">No orders in this category.</p>}
    </div>
  );
}
