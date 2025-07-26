import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tableNumber, items, total } = location.state || {}; // Get order details

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [backendUrl, setBackendUrl] = useState("");

  useEffect(() => {
    const fetchBackendIP = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/ip"); // Get dynamic backend IP
        const data = await response.json();
        console.log("Backend IP:", data.ip);
        setBackendUrl(`http://${data.ip}:5000`);
      } catch (error) {
        console.error("❌ Error fetching backend IP:", error);
        setBackendUrl(`http://${window.location.hostname}:5000`); // Fallback
      }
    };

    fetchBackendIP();
  }, []);

  const handlePayment = async () => {
    if (!cardNumber || !expiryDate || !cvv) {
      alert("⚠️ Please enter all payment details.");
      return;
    }

    setIsProcessing(true);

    const orderData = {
      tableNumber,
      items,
      totalCost: total,
      paymentDetails: {
        cardNumber: cardNumber.slice(-4), // Store only last 4 digits for security
        expiryDate,
        cvv, // CVV should NOT be stored in production
        paymentMethod: "Card",
        paymentStatus: "Success",
        transactionId: `TXN${Date.now()}`, // Generating a mock transaction ID
      },
    };

    try {
      const response = await fetch(`${backendUrl}/api/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        setIsProcessing(false);
        setPaymentDone(true);
        
        alert("✅ Payment Successful!\nYour order has been confirmed.");
        navigate("/order-tracking", { state: { tableNumber } });
      } else {
        throw new Error(data.message || "Payment failed. Please try again.");
      }
    } catch (error) {
      setIsProcessing(false);
      alert(`❌ Payment Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        {!paymentDone ? (
          <>
            <h2 className="text-2xl font-bold text-center mb-4">💳 Payment Gateway</h2>

            <p className="text-lg font-semibold text-center bg-orange-100 text-orange-700 py-2 rounded-lg">
              Table Number: <span className="font-bold">{tableNumber}</span>
            </p>
            <p className="text-lg text-center text-gray-700 mt-2">
              Total Amount: <span className="font-bold text-green-600">₹{total}</span>
            </p>

            <div className="mt-4">
              <label className="block text-gray-700 mb-1">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full px-3 py-2 border rounded-md"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />

              <div className="flex gap-2 mt-2">
                <div className="w-1/2">
                  <label className="block text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border rounded-md"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-gray-700 mb-1">CVV</label>
                  <input
                    type="password"
                    placeholder="•••"
                    className="w-full px-3 py-2 border rounded-md"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                  />
                </div>
              </div>

              <button
                onClick={handlePayment}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors mt-4"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing Payment..." : "💳 Pay Now"}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">✅ Payment Successful!</h2>
            <p className="text-lg">Your order has been confirmed.</p>
          </div>
        )}
      </div>
    </div>
  );
}
