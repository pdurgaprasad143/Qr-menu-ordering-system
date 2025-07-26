import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import OrdersCard from './OrderCard';
import MessageCard from './MessageCard';
import AddItem from './AddItem';
import ManageItems from './ManageItems';
import AddTable from './AddTable';
import ManageTable from './ManageTable';
import AddCategory from "./AddCategory";

export default function ChefDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <Routes>
          <Route path="orders" element={<OrdersCard />} />
          <Route path="messages" element={<MessageCard />} />
          <Route path="add-item" element={<AddItem />} />
          <Route path="manage-items" element={<ManageItems />} />
          <Route path="add-table" element={<AddTable />} />
          <Route path="manage-table" element={<ManageTable />} />
          <Route path="add-category" element={<AddCategory />} />
        </Routes>
      </div>
    </div>
  );
}
