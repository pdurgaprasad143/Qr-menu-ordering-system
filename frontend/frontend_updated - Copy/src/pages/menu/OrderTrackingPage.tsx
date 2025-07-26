import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function OrderTrackingPage() {
  const location = useLocation();
  const { tableNumber } = location.state || {}; // Get table number from navigation state
  const [backendUrl, setBackendUrl] = useState("");
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBackendIP = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/ip"); // Get backend IP
        const data = await response.json();
        setBackendUrl(`http://${data.ip}:5000`);
      } catch (error) {
        console.error("❌ Error fetching backend IP:", error);
        setBackendUrl(`http://${window.location.hostname}:5000`);
      }
    };

    fetchBackendIP();
  }, []);

  useEffect(() => {
    if (!backendUrl || !tableNumber) return;

    const fetchOrderStatus = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/orders/status?tableNumber=${tableNumber}`);
        const data = await response.json();

        if (data.success) {
          setOrderStatus(data.status);
        } else {
          console.error("❌ No order found:", data.message);
          setOrderStatus(null);
        }
      } catch (error) {
        console.error("❌ Error fetching order status:", error);
        setOrderStatus(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus(); // Fetch immediately

    // 🔄 Auto-refresh every 5 seconds
    const interval = setInterval(fetchOrderStatus, 3000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [backendUrl, tableNumber]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-4">📦 Order Tracking</h2>

        {loading ? (
          <p className="text-center text-gray-700">⏳ Loading order status...</p>
        ) : orderStatus ? (
          <>
            <p className="text-lg font-semibold text-center bg-blue-100 text-blue-700 py-2 rounded-lg">
              Table Number: <span className="font-bold">{tableNumber}</span>
            </p>
            <p className="text-lg text-center text-gray-700 mt-2">
              Status:{" "}
              <span className="font-bold text-green-600">{orderStatus}</span>
            </p>
          </>
        ) : (
          <p className="text-center text-red-500">❌ No order found for this table.</p>
        )}
      </div>
    </div>
  );
}
