import React from 'react';
import { XCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const ActionButtons = ({ currentOrder, handleCancelOrder, navigate }) => {
  return (
    <div className="space-y-4">
      {currentOrder.status === 'pending' && (
        <button
          onClick={handleCancelOrder}
          className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors flex items-center justify-center"
        >
          <XCircle className="h-5 w-5 mr-2" />
          Cancel Order
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
  );
};

export default ActionButtons;
