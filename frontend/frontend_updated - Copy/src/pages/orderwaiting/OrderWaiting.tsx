import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderStatus from './OrderStatus';
import OrderDetails from './OrderDetails';
import Payment from './Payment';
import ActionButtons from './ActionButtons';

export default function OrderWaiting({ currentOrder, updateOrderStatus, updatePaymentStatus }) {
  const navigate = useNavigate();
  const [showCancelMessage, setShowCancelMessage] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  useEffect(() => {
    if (!currentOrder) {
      navigate('/menu');
      return;
    }

    if (currentOrder.status === 'completed' && currentOrder.paymentStatus === 'completed') {
      const timer = setTimeout(() => {
        navigate('/rating');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentOrder, navigate]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsRazorpayLoaded(true);
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const handleCancelOrder = async () => {
    if (currentOrder?.status === 'pending') {
      await updateOrderStatus(currentOrder.id, 'rejected');
      setShowCancelMessage(true);
      setTimeout(() => {
        setShowCancelMessage(false);
        navigate('/menu');
      }, 3000);
    }
  };

  const handlePayment = async () => {
    if (!isRazorpayLoaded) return;
    setIsProcessingPayment(true);

    const options = {
      key: "rzp_test_rLTLjoJMjlk2Sz",
      amount: currentOrder.total * 100,
      currency: "INR",
      name: "Restaurant Name",
      description: `Payment for Order #${String(currentOrder.id).slice(-4)}`,
      handler: response => {
        if (response.razorpay_payment_id) {
          updatePaymentStatus(currentOrder.id, 'completed');
          setShowPaymentSuccess(true);
          setTimeout(() => setShowPaymentSuccess(false), 3000);
        }
      },
      prefill: { name: "Customer", email: "customer@example.com" },
      notes: { orderId: currentOrder.id, tableNumber: currentOrder.tableNumber },
      theme: { color: "#22c55e" }
    };

    new window.Razorpay(options).open();
    setIsProcessingPayment(false);
  };

  if (!currentOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">No active order found</p>
          <button
            onClick={() => navigate('/menu')}
            className="mt-4 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
          >
            Place an Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <OrderStatus status={currentOrder.status} />
        <OrderDetails currentOrder={currentOrder} />

        <div className="space-y-4">
          {showPaymentSuccess && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
              <p className="text-green-700 font-medium">Payment completed successfully! Thank you for dining with us.</p>
            </div>
          )}

          {currentOrder.status === 'ready' && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
              <p className="text-green-700 font-medium">Your order is ready! Please wait for the Waiter.</p>
            </div>
          )}

          {currentOrder.paymentStatus === 'pending' && currentOrder.status !== 'rejected' && (
            <Payment
              currentOrder={currentOrder}
              handlePayment={handlePayment}
              isProcessingPayment={isProcessingPayment}
            />
          )}

          <ActionButtons
            currentOrder={currentOrder}
            handleCancelOrder={handleCancelOrder}
            navigate={navigate}
          />
        </div>
      </div>
    </div>
  );
}
