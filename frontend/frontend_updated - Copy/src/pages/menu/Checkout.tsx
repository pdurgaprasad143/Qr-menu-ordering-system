import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tableNumber, items, total } = location.state || {}; // Get data from navigation

  // Handle missing data (redirect or show an error)
  if (!tableNumber || !items || items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-center text-red-500 text-lg font-semibold">
          ⚠️ Invalid order details! Please return to the menu.
        </p>
      </div>
    );
  }

  // Function to navigate to the payment page
  const handleProceedToPayment = () => {
    navigate("/payment", { state: { tableNumber, items, total } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-4">🛒 Checkout</h2>

        {/* Display Table Number */}
        <p className="text-lg font-semibold text-center bg-orange-100 text-orange-700 py-2 rounded-lg">
          Table Number: <span className="font-bold">{tableNumber}</span>
        </p>

        {/* Order Summary */}
        <h3 className="text-lg font-semibold mt-4">Order Summary:</h3>
        <ul className="mb-4 border border-gray-300 rounded-md p-3 bg-gray-50">
          {items.map((item) => (
            <li key={item.name} className="flex justify-between py-1">
              <span>{item.name} (x{item.quantity})</span>
              <span className="font-bold">₹{item.price * item.quantity}</span>
            </li>
          ))}
        </ul>

        {/* Total Price */}
        <p className="text-lg font-bold text-center text-gray-700 mb-4">
          Total: <span className="text-green-600">₹{total}</span>
        </p>

        {/* Proceed to Payment Button */}
        <button
          onClick={handleProceedToPayment}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          💳 Proceed to Payment
        </button>
      </div>
    </div>
  );
}
