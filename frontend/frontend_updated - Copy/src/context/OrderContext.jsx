import { createContext, useState, useContext, useEffect } from "react";

const OrderContext = createContext();

// Key for localStorage
const ORDERS_STORAGE_KEY = 'restaurant_orders';

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    try {
      // Initialize orders from localStorage if available
      const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      const parsedOrders = storedOrders ? JSON.parse(storedOrders) : [];
      // Sort orders by timestamp, most recent first
      return parsedOrders.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.error('Error loading orders:', error);
      return [];
    }
  });

  useEffect(() => {
    // Listen for storage events from other tabs
    const handleStorageChange = (event) => {
      if (event.key === ORDERS_STORAGE_KEY) {
        try {
          const newOrders = JSON.parse(event.newValue || '[]');
          // Sort orders by timestamp, most recent first
          setOrders(newOrders.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        } catch (error) {
          console.error('Error handling storage change:', error);
        }
      }
    };

    // Add storage event listener
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Function to update localStorage and trigger cross-tab updates
  const updateStorage = (newOrders) => {
    try {
      // Sort orders by timestamp, most recent first
      const sortedOrders = newOrders.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(sortedOrders));
      setOrders(sortedOrders);

      // Dispatch storage event to notify other tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: ORDERS_STORAGE_KEY,
        newValue: JSON.stringify(sortedOrders)
      }));
    } catch (error) {
      console.error('Error updating storage:', error);
    }
  };

  // Function to add an order
  const addOrder = (orderData) => {
    try {
      // Ensure we have a valid table number
      const tableNumber = Number(orderData.tableNumber);
      if (!tableNumber || isNaN(tableNumber)) {
        console.error('Invalid table number:', orderData.tableNumber);
        return null;
      }

      // Create new order with all necessary details
      const newOrder = {
        id: Date.now(),
        tableNumber: tableNumber,
        items: orderData.items.map(item => ({
          id: item.id || Date.now() + Math.random(),
          name: item.name,
          description: item.description || '',
          price: Number(item.price),
          quantity: Number(item.quantity),
          category: item.category || ''
        })),
        status: "pending",
        paymentStatus: "pending",
        timestamp: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        total: Number(orderData.total)
      };
      
      // Log the new order for debugging
      console.log('Creating new order:', newOrder);
      
      const updatedOrders = [...orders, newOrder];
      updateStorage(updatedOrders);
      return newOrder;
    } catch (error) {
      console.error('Error adding order:', error);
      return null;
    }
  };

  // Function to update order status
  const updateOrderStatus = async (orderId, status) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId 
        ? { 
            ...order, 
            status,
            lastUpdated: new Date().toISOString()
          } 
        : order
    );
    updateStorage(updatedOrders);
    return updatedOrders.find(order => order.id === orderId);
  };

  // Function to update payment status
  const updatePaymentStatus = async (orderId, paymentStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId 
        ? { 
            ...order, 
            paymentStatus,
            lastUpdated: new Date().toISOString()
          } 
        : order
    );
    updateStorage(updatedOrders);
    return updatedOrders.find(order => order.id === orderId);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, updatePaymentStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;
