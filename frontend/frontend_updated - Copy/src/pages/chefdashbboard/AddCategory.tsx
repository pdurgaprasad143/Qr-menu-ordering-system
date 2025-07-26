import React, { useState, useEffect } from "react";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories/");
      if (!response.ok) throw new Error("Failed to fetch categories");

      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Load data on component mount and whenever categories change
  useEffect(() => {
    fetchCategories();
  }, [categories]); // 🟢 Depend on `categories` to auto-refresh after add/edit/delete

  // Handle Add / Edit Category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setLoading(true);
    setMessage("");

    try {
      const url = editMode
        ? `http://localhost:5000/api/categories/${editId}`
        : "http://localhost:5000/api/categories/";
      const method = editMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: categoryName }),
      });

      if (!response.ok) throw new Error(`Failed to ${editMode ? "update" : "add"} category`);

      const newCategory = await response.json();

      // Refresh data instantly
      fetchCategories();

      setCategoryName("");
      setEditMode(false);
      setEditId(null);
      setMessage(editMode ? "Category updated successfully!" : "Category added successfully!");
    } catch (error) {
      console.error("Error saving category:", error);
      setMessage(`Error ${editMode ? "updating" : "adding"} category. Try again!`);
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete Category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete category");

      // Refresh data instantly
      fetchCategories();

      setMessage("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      setMessage("Error deleting category. Try again!");
    }
  };

  // Handle Edit Category
  const handleEdit = (category) => {
    setCategoryName(category.name);
    setEditMode(true);
    setEditId(category._id);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{editMode ? "Edit Category" : "Add New Category"}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Category Name</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter category name"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (editMode ? "Updating..." : "Adding...") : editMode ? "Update Category" : "Add Category"}
        </button>
      </form>

      {/* Display Message */}
      {message && (
        <p className={`mt-4 text-center ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>
          {message}
        </p>
      )}

      {/* Display Categories */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Existing Categories</h3>
        <div className="grid grid-cols-2 gap-4">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category._id} className="bg-gray-100 p-4 rounded-lg shadow flex justify-between items-center">
                <span className="text-gray-800 font-medium">{category.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No categories found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
