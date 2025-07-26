import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Quote, Leaf, ChefHat, Coffee, Clock, AlertCircle } from 'lucide-react';
import { useRating } from '../context/RatingContext';
import { useOrders } from '../context/OrderContext';

export default function Home() {
  const navigate = useNavigate();
  const { ratings } = useRating();
  const { orders } = useOrders();
  const [hasRecentOrder, setHasRecentOrder] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Check for active or recent orders (within the last 24 hours)
  useEffect(() => {
    const checkRecentOrders = () => {
      if (!orders || orders.length === 0) return false;
      
      const lastOrder = orders[orders.length - 1];
      if (!lastOrder) return false;

      // Check if order is active (not completed or rejected)
      const isActive = lastOrder.status !== 'completed' && lastOrder.status !== 'rejected';
      
      // Check if order is recent and pending/preparing/ready
      const isPendingOrActive = ['pending', 'preparing', 'ready'].includes(lastOrder.status);
      
      // Check if order is recent (within last 24 hours)
      const orderTime = new Date(lastOrder.timestamp).getTime();
      const now = new Date().getTime();
      const isRecent = now - orderTime < 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      // Enable button if order is pending/active OR if it's recent and completed
      return isPendingOrActive || (isRecent && isActive);
    };

    setHasRecentOrder(checkRecentOrders());
  }, [orders]);

  const handleTrackOrder = () => {
    // Always navigate to order-waiting page
    navigate('/order-waiting');
  };

  return (
    <div className="min-h-screen">
      <div className="relative h-[600px]">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&auto=format&fit=crop"
          alt="Restaurant interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"> 
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Welcome to QR Restaurant</h1>
            <p className="text-xl mb-8">Come Join Us For A Magical Experience.</p>
            <div className="flex flex-col items-center space-y-4">
              <Link
                to="/menu"
                className="bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors w-48"
              >
                View Menu
              </Link>
              <div className="relative">
                {hasRecentOrder ? (
                  <button
                    onClick={handleTrackOrder}
                    className="w-48 inline-flex items-center justify-center px-8 py-3 rounded-full transition-colors bg-yellow-500 text-white hover:bg-yellow-600"
                  >
                    <Clock className="w-5 h-5 mr-2" />
                    Track Order
                  </button>
                ) : (
                  <button
                    onClick={handleTrackOrder}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="w-48 inline-flex items-center justify-center px-8 py-3 rounded-full transition-colors bg-yellow-400 text-white hover:bg-gray-500"
                  >
                    <Clock className="w-5 h-5 mr-2" />
                    Track Order
                  </button>
                )}
                {showTooltip && !hasRecentOrder && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded-md whitespace-nowrap flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    track your order
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                  </div>
                )}
              </div>
              <Link
                to="/contact"
                className="bg-white text-orange-500 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors w-48"
              >
                Book a Table
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose Us</h2>
          <p className="mt-4 text-lg text-gray-600">
            Experience the perfect blend of quality, expertise, and ambiance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="bg-orange-100 p-3 rounded-full mb-4">
                <Leaf className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Fresh Ingredients</h3>
              <p className="text-gray-600">We use only the finest, locally-sourced ingredients</p>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="bg-orange-100 p-3 rounded-full mb-4">
                <ChefHat className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Expert Chefs</h3>
              <p className="text-gray-600">Our master chefs create culinary masterpieces</p>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="bg-orange-100 p-3 rounded-full mb-4">
                <Coffee className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Cozy Atmosphere</h3>
              <p className="text-gray-600">Enjoy your meal in our warm, welcoming environment</p>
            </div>
          </div>
        </div>
        <div className="text-center">
          <Link
            to="/reviews"
            className="bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors inline-flex items-center"
          >
            <Star className="w-5 h-5 mr-2" />
            View All Reviews
          </Link>
        </div>
        {/* Add a loading state while fetching ratings */}
        {!ratings ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading reviews...</p>
          </div>
        ) : ratings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No reviews yet. Be the first to leave one!</p>
          </div>
        ) : null}

        {ratings && ratings.length > 0 && (
          <div className="bg-gray-50 rounded-2xl p-8 mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Customer Reviews</h2>
              <p className="mt-4 text-lg text-gray-600">
                What our valued customers say about their dining experience
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ratings.slice(-6).reverse().map((rating, index) => (
                <div 
                  key={rating.timestamp} 
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= rating.score
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <Quote className="h-8 w-8 text-orange-200" />
                  </div>
                  
                  {rating.feedback && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      "{rating.feedback}"
                    </p>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="font-semibold text-gray-900">{rating.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(rating.timestamp).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link
                to="/rating"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-150"
              >
                Share Your Experience
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}