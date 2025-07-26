import React, { createContext, useContext, useState, useEffect } from 'react';

const MessageContext = createContext(undefined);

export function MessageProvider({ children }) {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('restaurant_messages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  useEffect(() => {
    localStorage.setItem('restaurant_messages', JSON.stringify(messages));
  }, [messages]);

  const addMessage = (messageData) => {
    const newMessage = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    setMessages(prev => [newMessage, ...prev]);
  };

  const markAsRead = (id) => {
    setMessages(prev =>
      prev.map(message =>
        message.id === id ? { ...message, read: true } : message
      )
    );
  };

  const updateMessageStatus = (id, status) => {
    setMessages(prev =>
      prev.map(message =>
        message.id === id ? { ...message, status } : message
      )
    );
  };

  const unreadCount = messages.filter(message => !message.read).length;

  return (
    <MessageContext.Provider value={{ messages, addMessage, markAsRead, updateMessageStatus, unreadCount }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
}