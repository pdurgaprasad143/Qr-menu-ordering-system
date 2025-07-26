import { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // Calculate total price
  const total = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  // Function to add an item to the cart
  const addToCart = (item) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(i => i.name === item.name);
      if (existingItem) {
        return prevItems.map(i => 
          i.name === item.name 
            ? { 
                ...i,
                quantity: (i.quantity || 1) + 1,
                price: item.price // Ensure price is updated if it changed
              }
            : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  // Function to remove an item from the cart
  const removeFromCart = (itemName) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(i => i.name === itemName);
      if (existingItem && existingItem.quantity > 1) {
        return prevItems.map(i =>
          i.name === itemName
            ? { ...i, quantity: i.quantity - 1 }
            : i
        );
      }
      return prevItems.filter((item) => item.name !== itemName);
    });
  };

  // Function to clear the cart
  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
