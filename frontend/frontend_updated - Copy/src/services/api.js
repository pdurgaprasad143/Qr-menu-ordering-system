const API_URL = 'http://localhost:5000/api';

export const api = {
  // Auth
  login: async (username, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return response.json();
  },

  // Orders
  getOrders: async () => {
    const response = await fetch(`${API_URL}/orders`);
    return response.json();
  },

  createOrder: async (orderData) => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return response.json();
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return response.json();
  },

  // Ratings
  getRatings: async () => {
    const response = await fetch(`${API_URL}/ratings`);
    return response.json();
  },

  createRating: async (ratingData) => {
    const response = await fetch(`${API_URL}/ratings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ratingData)
    });
    return response.json();
  },

  // Messages
  getMessages: async () => {
    const response = await fetch(`${API_URL}/messages`);
    return response.json();
  },

  createMessage: async (messageData) => {
    const response = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData)
    });
    return response.json();
  }
}; 