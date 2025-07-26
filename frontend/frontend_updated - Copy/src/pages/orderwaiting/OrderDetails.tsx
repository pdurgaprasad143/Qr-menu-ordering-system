import React from 'react';

const OrderDetails = ({ currentOrder }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Order #{currentOrder?.id ? String(currentOrder.id).slice(-4).padStart(4, '0') : 'N/A'}</span>
        <span>Table {currentOrder?.tableNumber || 'N/A'}</span>
      </div>

      {currentOrder.status !== 'rejected' && (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${currentOrder.status === 'pending' ? 25 : currentOrder.status === 'preparing' ? 50 : currentOrder.status === 'ready' ? 100 : 0}%` }}
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
  );
};

export default OrderDetails;
