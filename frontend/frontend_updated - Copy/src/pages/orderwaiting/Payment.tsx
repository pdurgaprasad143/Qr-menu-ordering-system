import React from 'react';
import { CreditCard } from 'lucide-react';

const Payment = ({ currentOrder, handlePayment, isProcessingPayment }) => {
  return (
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
  );
};

export default Payment;
