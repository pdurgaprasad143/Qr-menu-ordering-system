import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Clock, ChefHat, CheckCircle, UtensilsCrossed, XCircle, Star, CreditCard } from 'lucide-react';
import { useOrders } from '../context/OrderContext';

export default function OrderWaiting() {
  const navigate = useNavigate();
  const { orders, updateOrderStatus, updatePaymentStatus } = useOrders();
  const [currentOrder, setCurrentOrder] = useState(null);
  const [showCancelMessage, setShowCancelMessage] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    // Get the latest order and keep it updated in real-time
    const getLatestOrder = () => {
      // Sort orders by timestamp to ensure we get the most recent
      const sortedOrders = [...orders].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      return sortedOrders[0] || null;
    };

    const latestOrder = getLatestOrder();
    console.log('Latest Order in OrderWaiting:', latestOrder); // Debug log
    
    if (latestOrder) {
      setCurrentOrder(latestOrder);
      
      // Only navigate to rating if the order is completed AND paid
      if (latestOrder.status === 'completed' && latestOrder.paymentStatus === 'completed') {
        const timer = setTimeout(() => {
          navigate('/rating');
        }, 3000);
        return () => clearTimeout(timer);
      }
    } else {
      // If no order exists, redirect to menu
      navigate('/menu');
    }
  }, [orders, navigate]); // Make sure to include orders in dependencies

  // Update current order whenever orders change
  useEffect(() => {
    const updatedOrder = orders.find(order => order.id === currentOrder?.id);
    if (updatedOrder) {
      console.log('Updating current order:', updatedOrder); // Debug log
      setCurrentOrder(updatedOrder);
    }
  }, [orders, currentOrder?.id]);

  // Function to get the table number from the current order
  const getTableNumber = () => {
    return currentOrder?.tableNumber || 'N/A';
  };

  const handleCancelOrder = async () => {
    if (currentOrder && currentOrder.status === 'pending') {
      await updateOrderStatus(currentOrder.id, 'rejected');
      setShowCancelMessage(true);
      const timer = setTimeout(() => {
        setShowCancelMessage(false);
        navigate('/menu');
      }, 3000);
      return () => clearTimeout(timer);
    }
  };

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    setIsProcessingPayment(true);

    try {
      const options = {
        key: "rzp_test_rLTLjoJMjlk2Sz",
        amount: (currentOrder.total * 100),
        currency: "INR",
        name: "Restaurant Name",
        description: `Payment for Order #${String(currentOrder.id).slice(-4)}`,
        handler: function (response) {
          // Handle successful payment
          console.log("Payment successful", response);
          // Update payment status instead of order status
          if (response.razorpay_payment_id) {
            updatePaymentStatus(currentOrder.id, 'completed');
            setShowPaymentSuccess(true);
            // Show success message for 3 seconds
            setTimeout(() => {
              setShowPaymentSuccess(false);
            }, 3000);
          }
        },
        prefill: {
          name: "Customer",
          email: "customer@example.com",
          contact: "",
        },
        notes: {
          orderId: currentOrder.id,
          tableNumber: currentOrder.tableNumber
        },
        theme: {
          color: "#22c55e"
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="h-6 w-6 text-yellow-500" />,
          text: 'Order Received',
          description: 'Your order has been sent to the kitchen',
          color: 'text-yellow-500',
          progress: 25
        };
      case 'preparing':
        return {
          icon: <ChefHat className="h-6 w-6 text-blue-500" />,
          text: 'Preparing Your Order',
          description: 'Our chefs are cooking your delicious meal',
          color: 'text-blue-500',
          progress: 50
        };
      case 'ready':
        return {
          icon: <UtensilsCrossed className="h-6 w-6 text-green-500" />,
          text: 'Order Ready',
          description: 'Your order is ready for pickup',
          color: 'text-green-500',
          progress: 100
        };
      case 'completed':
        return {
          icon: <CheckCircle className="h-6 w-6 text-gray-500" />,
          text: 'Order Completed',
          description: 'Thank you for dining with us',
          color: 'text-gray-500',
          progress: 100
        };
      case 'rejected':
        return {
          icon: <XCircle className="h-6 w-6 text-red-500" />,
          text: 'Order Cancelled',
          description: 'Your order has been cancelled successfully',
          color: 'text-red-500',
          progress: 0
        };
      default:
        return {
          icon: <Clock className="h-6 w-6 text-orange-500" />,
          text: 'Processing Order',
          description: 'Please wait while we process your order',
          color: 'text-orange-500',
          progress: 0
        };
    }
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

  const statusInfo = getStatusInfo(currentOrder.status);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              {statusInfo.icon}
            </div>
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${statusInfo.color}`}>
            {statusInfo.text}
          </h2>
          <p className="text-gray-600">
            {statusInfo.description}
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Order #{currentOrder?.id ? String(currentOrder.id).slice(-4).padStart(4, '0') : 'N/A'}</span>
            <span>Table {getTableNumber()}</span>
          </div>
          
          {currentOrder.status !== 'rejected' && (
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${statusInfo.progress}%` }}
              ></div>
            </div>
          )}

          <div className="space-y-2">
            {currentOrder.items?.map((item, index) => (
              <div key={item.id || index} className="flex justify-between text-sm">
                <div className="flex-1">
                  <span className="font-medium">{item.quantity}x {item.name}</span>
                  {item.description && (
                    <p className="text-gray-500 text-xs mt-0.5">{item.description}</p>
                  )}
                </div>
                <span className="ml-4 font-medium">₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{currentOrder.total ? Number(currentOrder.total).toFixed(2) : '0.00'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {showPaymentSuccess && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
              <p className="text-green-700 font-medium">
                Payment completed successfully! Thank you for dining with us.
              </p>
            </div>
          )}

          {currentOrder.status === 'ready' && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
              <p className="text-green-700 font-medium">
                Your order is ready! Please wait for the Waiter.
              </p>
            </div>
          )}

          {currentOrder.status === 'pending' && (
            <button
              onClick={handleCancelOrder}
              className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors flex items-center justify-center"
            >
              <XCircle className="h-5 w-5 mr-2" />
              Cancel Order
            </button>
          )}

          {currentOrder.paymentStatus === 'pending' && currentOrder.status !== 'rejected' && (
            <button
              onClick={handlePayment}
              disabled={isProcessingPayment}
              className={`w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center ${
                isProcessingPayment ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              <CreditCard className="h-5 w-5 mr-2" />
              {isProcessingPayment ? (
                <span className="flex items-center">
                  Processing...
                  <svg className="animate-spin ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : (
                `Pay Now (₹${currentOrder.total ? Number(currentOrder.total).toFixed(2) : '0.00'})`
              )}
            </button>
          )}

          <button
            onClick={() => navigate('/menu')}
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
          >
            Place Another Order
          </button>

          <Link
            to="/"
            className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center"
          >
            Return to Home
          </Link>
          
          {(currentOrder.status === 'completed' || currentOrder.status === 'rejected') && (
            <button
              onClick={() => navigate('/rating')}
              className="w-full flex items-center justify-center bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors"
            >
              <Star className="h-5 w-5 mr-2" />
              Rate Your Experience
            </button>
          )}
        </div>
      </div>
    </div>
  );
}