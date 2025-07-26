import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Orders from "./Orders";
import Messages from "./Messages";
import AddItem from "./AddItem";
import ManageItems from "./ManageItems";


export default function ChefDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar should always be visible */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<Orders />} />
          <Route path="orders" element={<Orders />} />
          <Route path="messages" element={<Messages />} />
          <Route path="add-item" element={<AddItem />} />
          <Route path="manage-items" element={<ManageItems />} />
          <Route path="add-category" element={<AddCategory />} />
        </Routes>
      </div>
    </div>
  );
}
