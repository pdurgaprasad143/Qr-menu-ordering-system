import React from "react"; 
import { NavLink, useNavigate } from "react-router-dom";
import { List, MessageSquare, PlusCircle, Settings, Table, LayoutList, LogOut, FolderPlus } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("chefId");
    localStorage.removeItem("chefToken");
    navigate("/");
  };

  return (
    <div className="w-64 min-h-screen bg-gray-800 text-white p-4 flex flex-col">
      <div className="flex-grow">
        <h2 className="text-xl font-bold mb-6">Chef Dashboard</h2>
        <nav className="space-y-4">
          <NavLink to="orders" className={({ isActive }) => `flex items-center p-3 rounded-lg transition ${isActive ? "bg-orange-500" : "hover:bg-gray-700"}`}>
            <List className="w-5 h-5 mr-3" /> Orders
          </NavLink>
          <NavLink to="messages" className={({ isActive }) => `flex items-center p-3 rounded-lg transition ${isActive ? "bg-orange-500" : "hover:bg-gray-700"}`}>
            <MessageSquare className="w-5 h-5 mr-3" /> Messages
          </NavLink>
          <NavLink to="add-item" className={({ isActive }) => `flex items-center p-3 rounded-lg transition ${isActive ? "bg-orange-500" : "hover:bg-gray-700"}`}>
            <PlusCircle className="w-5 h-5 mr-3" /> Add Item
          </NavLink>
          <NavLink to="manage-items" className={({ isActive }) => `flex items-center p-3 rounded-lg transition ${isActive ? "bg-orange-500" : "hover:bg-gray-700"}`}>
            <Settings className="w-5 h-5 mr-3" /> Manage Items
          </NavLink>
          <NavLink to="add-category" className={({ isActive }) => `flex items-center p-3 rounded-lg transition ${isActive ? "bg-orange-500" : "hover:bg-gray-700"}`}>
            <FolderPlus className="w-5 h-5 mr-3" /> Add Category
          </NavLink>
          <NavLink to="add-table" className={({ isActive }) => `flex items-center p-3 rounded-lg transition ${isActive ? "bg-orange-500" : "hover:bg-gray-700"}`}>
            <Table className="w-5 h-5 mr-3" /> Add Table
          </NavLink>
          <NavLink to="manage-table" className={({ isActive }) => `flex items-center p-3 rounded-lg transition ${isActive ? "bg-orange-500" : "hover:bg-gray-700"}`}>
            <LayoutList className="w-5 h-5 mr-3" /> Manage Table
          </NavLink>
        </nav>
      </div>

      <div className="mt-2">
        <button
          onClick={handleLogout}
          className="flex items-center p-3 rounded-lg transition bg-red-600 hover:bg-red-700 w-full"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
