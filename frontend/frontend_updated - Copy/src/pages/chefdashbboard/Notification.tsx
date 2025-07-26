import React from 'react';
import { Bell, MessageSquare } from 'lucide-react';

const Notification = ({ notification, unreadCount }) => {
  return (
    <div className="flex items-center space-x-4">
      {notification && (
        <div className="flex items-center bg-red-500 text-white px-4 py-2 rounded-full animate-pulse">
          <Bell className="h-5 w-5 mr-2" />
          New Orders!
        </div>
      )}
      {unreadCount > 0 && (
        <div className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full">
          <MessageSquare className="h-5 w-5 mr-2" />
          {unreadCount} New Messages
        </div>
      )}
    </div>
  );
};

export default Notification;
