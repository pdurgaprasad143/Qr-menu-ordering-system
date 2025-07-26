import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRating } from '../../context/RatingContext';
import { useOrders } from '../../context/OrderContext';
import Header from './Header';
import WhyChooseUs from './WhyChooseUs';
import CustomerReviews from './CustomerReviews';

export default function Home() {
  const navigate = useNavigate();
  const { ratings } = useRating();
  const { orders } = useOrders();
  const [hasRecentOrder, setHasRecentOrder] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const checkRecentOrders = () => {
      if (!orders || orders.length === 0) return false;

      const lastOrder = orders[orders.length - 1];
      if (!lastOrder) return false;

      const isActive = lastOrder.status !== 'completed' && lastOrder.status !== 'rejected';
      const isPendingOrActive = ['pending', 'preparing', 'ready'].includes(lastOrder.status);
      const orderTime = new Date(lastOrder.timestamp).getTime();
      const now = new Date().getTime();
      const isRecent = now - orderTime < 24 * 60 * 60 * 1000;

      return isPendingOrActive || (isRecent && isActive);
    };

    setHasRecentOrder(checkRecentOrders());
  }, [orders]);

  const handleTrackOrder = () => {
    navigate('/order-waiting');
  };

  return (
    <div className="min-h-screen">
      <Header
        hasRecentOrder={hasRecentOrder}
        showTooltip={showTooltip}
        setShowTooltip={setShowTooltip}
        handleTrackOrder={handleTrackOrder}
      />
      <WhyChooseUs />
      {!ratings ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      ) : ratings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No reviews yet. Be the first to leave one!</p>
        </div>
      ) : (
        <CustomerReviews ratings={ratings} />
      )}
    </div>
  );
}
