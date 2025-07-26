import React from 'react';

const TabNavigation = ({ activeTab, setActiveTab, unreadCount }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'orders'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'messages'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Messages {unreadCount > 0 && `(${unreadCount})`}
        </button>
      </nav>
    </div>
  );
};

export default TabNavigation;
