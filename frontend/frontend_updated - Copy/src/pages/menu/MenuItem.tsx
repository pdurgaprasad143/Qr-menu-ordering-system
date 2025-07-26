import React from 'react';
import { Plus, Minus } from 'lucide-react';

const MenuItem = ({ item, getItemQuantity, handleAddToCart, removeFromCart }) => {
  console.log(item);
  return (
    <div key={item.name} className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
      {/* Dish Image */}
      <img 
        src={item.imageUrl} 
        alt={item.name} 
        className="w-32 h-32 object-cover rounded-lg mb-4"
      />

      {/* Dish Name, Description & Price */}
      <h3 className="text-lg font-semibold text-center">{item.name}</h3>
      {item.description && (
        <p className="text-gray-600 mt-1 text-sm text-center">{item.description}</p>
      )}
      <p className="text-orange-600 font-semibold mt-2">₹{item.price}</p>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2 mt-3">
        {getItemQuantity(item.name) > 0 && (
          <>
            <button
              onClick={() => removeFromCart(item.name)}
              className="p-1 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center">{getItemQuantity(item.name)}</span>
          </>
        )}
        <button
          onClick={() => handleAddToCart(item)}
          className="p-1 rounded-full bg-orange-600 text-white hover:bg-orange-700"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MenuItem;
