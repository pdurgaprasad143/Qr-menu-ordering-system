import React from 'react';
import { Clock, ChefHat, CheckCircle, UtensilsCrossed, XCircle } from 'lucide-react';

const OrderStatus = ({ status }) => {
  const getStatusInfo = () => {
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

  const statusInfo = getStatusInfo();

  return (
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
  );
};

export default OrderStatus;
