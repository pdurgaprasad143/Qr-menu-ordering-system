import React, { useEffect, useState } from "react";

const ManageItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch dishes from API
  useEffect(() => {
    fetchDishes();
    fetchCategories();
  }, []);

  const fetchDishes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/dishes/");
      const data = await response.json();
      if (data.success) {
        setItems(data.dishes);
      } else {
        console.error("Failed to fetch dishes");
      }
    } catch (error) {
      console.error("Error fetching dishes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for the dropdown
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories/");
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Delete dish function
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dish?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/dishes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setItems(items.filter((item) => item._id !== id));
        alert("Dish deleted successfully!");
      } else {
        alert("Failed to delete dish.");
      }
    } catch (error) {
      console.error("Error deleting dish:", error);
      alert("Error deleting dish.");
    }
  };

  // Open edit modal
  const openEditModal = (item) => {
    setEditItem(item);
  };

  // Handle input change in edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditItem({ ...editItem, [name]: value });
  };

  // Handle update dish API request
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/dishes/${editItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editItem),
      });

      if (response.ok) {
        alert("Dish updated successfully!");
        setEditItem(null);
        fetchDishes(); // Refresh data
      } else {
        alert("Failed to update dish.");
      }
    } catch (error) {
      console.error("Error updating dish:", error);
      alert("Error updating dish.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Manage Items</h2>

      {loading ? (
        <p className="text-gray-500">Loading dishes...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">No items available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item._id} className="p-4 border rounded-md shadow">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.category?.name || "Uncategorized"}</p>
              <p className="text-sm">{item.description}</p>
              <p className="text-lg font-semibold">₹{item.price}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => openEditModal(item)}
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Edit Dish</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Item Name"
                value={editItem.name}
                onChange={handleEditChange}
                required
                className="w-full p-2 border rounded-md"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={editItem.price}
                onChange={handleEditChange}
                required
                className="w-full p-2 border rounded-md"
              />
              <select
                name="category"
                value={editItem.category}
                onChange={handleEditChange}
                required
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <textarea
                name="description"
                placeholder="Description"
                value={editItem.description}
                onChange={handleEditChange}
                required
                className="w-full p-2 border rounded-md"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageItems;
