import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Table } from "lucide-react";
import MenuCategory from "./MenuCategory";
import MenuItem from "./MenuItem";
import CartSummary from "./CartSummary";

export default function Menu() {
  const location = useLocation();
  const [backendUrl, setBackendUrl] = useState(""); // ✅ Dynamically fetch backend IP
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [tableNumber, setTableNumber] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch the backend IP dynamically
  useEffect(() => {
    const fetchBackendIP = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/ip");
        const data = await response.json();
        console.log("Backend IP:", data.ip);
        setBackendUrl(`http://${data.ip}:5000`);
      } catch (error) {
        console.error("❌ Error fetching backend IP:", error);
        setBackendUrl(`http://${window.location.hostname}:5000`); // Fallback
      }
    };

    fetchBackendIP();
  }, []);

  // ✅ API Endpoints
  const API_CATEGORIES_URL = `${backendUrl}/api/categories/`;
  const API_DISHES_BY_CATEGORY_URL = `${backendUrl}/api/dishes/category/`;

  // ✅ Get table number from QR code URL or sessionStorage
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tableParam = params.get("table");
    const storedTable = sessionStorage.getItem("tableNumber");

    if (tableParam) {
      const parsedTable = parseInt(tableParam, 10);
      if (!isNaN(parsedTable) && parsedTable > 0 && parsedTable <= 25) {
        setTableNumber(parsedTable);
        sessionStorage.setItem("tableNumber", parsedTable.toString());
      }
    } else if (storedTable) {
      setTableNumber(parseInt(storedTable, 10));
    }
  }, [location]);

  // ✅ Fetch categories when component loads
  useEffect(() => {
    if (!backendUrl) return;

    const fetchCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Fetching categories...");
        const response = await fetch(API_CATEGORIES_URL);
        if (!response.ok) throw new Error("Failed to load categories");

        const data = await response.json();
        console.log("Categories data:", data);
        if (data.success && data.categories.length > 0) {
          setCategories(data.categories);
          setSelectedCategory(data.categories[0]._id); // Default to first category
        } else {
          throw new Error("No categories found");
        }
      } catch (err) {
        console.error("Error fetching categories:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [backendUrl]);

  // ✅ Fetch menu items when a category is selected
  useEffect(() => {
    if (!selectedCategory || !backendUrl) return;

    const fetchMenuItems = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(`Fetching items for category: ${selectedCategory}`);
        const response = await fetch(`${API_DISHES_BY_CATEGORY_URL}${selectedCategory}`);
        if (!response.ok) throw new Error("Failed to load menu items");

        const data = await response.json();
        if (data.success) {
          setMenuItems(data.dishes);
        } else {
          throw new Error("No menu items found");
        }
      } catch (err) {
        console.error("Error fetching menu items:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [selectedCategory, backendUrl]);

  // ✅ Handle Add to Cart
  const handleAddToCart = (item) => {
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.name === item.name);
      return existingItem
        ? prev.map((i) => (i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i))
        : [...prev, { ...item, quantity: 1 }];
    });
  };

  // ✅ Handle Remove from Cart
  const removeFromCart = (itemName) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i.name === itemName ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* ✅ Header with Table Number */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Our Menu</h1>
        <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full flex items-center">
          <Table className="h-5 w-5 mr-2" />
          <span>{tableNumber ? `Table ${tableNumber}` : "Select a Table"}</span>
        </div>
      </div>

      {/* ✅ Show Loading / Error */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {/* ✅ Category Selection */}
          {categories.length > 0 && (
            <MenuCategory
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          )}

          {/* ✅ Menu Items */}
          <div className="grid md:grid-cols-2 gap-6 mb-20">
            {menuItems.map((item) => (
              <MenuItem
                key={item._id}
                item={item}
                getItemQuantity={(name) => cartItems.find((i) => i.name === name)?.quantity || 0}
                handleAddToCart={handleAddToCart}
                removeFromCart={removeFromCart}
              />
            ))}
          </div>
        </>
      )}

      {/* ✅ Cart Summary with Table Number */}
      {cartItems.length > 0 && <CartSummary items={cartItems} tableNumber={tableNumber} />}
    </div>
  );
}
