import React from "react";
import { useNavigate } from "react-router-dom";

const CartSummary = ({ items, tableNumber }) => {
  const navigate = useNavigate();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (!tableNumber) {
      alert("Table number is missing. Please scan the QR code again.");
      return;
    }
    if (items.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Navigate to Checkout page with table number, items, and total
    navigate("/checkout", { state: { tableNumber, items, total } });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-md">
      {/* Table Number Display */}
      <div className="mb-2 text-center text-lg font-semibold text-orange-600">
        {tableNumber ? `Table ${tableNumber}` : "Table Not Selected"}
      </div>

      {/* Selected Items */}
      <div className="mb-2">
        <h3 className="text-lg font-bold">Selected Items:</h3>
        <ul>
          {items.map((item) => (
            <li key={item.name} className="flex justify-between">
              <span>{item.name} (x{item.quantity})</span>
              <span>₹{item.price * item.quantity}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Total Price & Checkout */}
      <div className="flex justify-between items-center">
        <p className="text-lg font-bold">Total: ₹{total}</p>
        <button
          onClick={handleCheckout}
          className="bg-orange-600 text-white px-4 py-2 rounded-md"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartSummary;
