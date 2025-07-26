import React, { useState, useEffect } from "react";

const CLOUD_NAME = "darekrw2y"; // Replace with your Cloudinary cloud name
const UPLOAD_PRESET = "qrmenu"; // Replace with your Cloudinary upload preset

const AddItem = () => {
  const [item, setItem] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    imageUrl: "",
  });
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch categories for dropdown
  useEffect(() => {
    fetch("http://localhost:5000/api/categories/")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.categories);
        }
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const chefId = localStorage.getItem("chefId");
    if (!chefId) {
      alert("Chef ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", UPLOAD_PRESET);

      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        const imageUrl = data.secure_url;

        // Prepare item data with category ID
        const newItem = {
          chef: chefId, // Correctly include the chef ID
          name: item.name,
          price: item.price,
          category: item.category, // Now sending category ID, not name
          description: item.description,
          imageUrl: imageUrl,
        };

        const res = await fetch("http://localhost:5000/api/dishes/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newItem),
        });

        const resData = await res.json();

        if (res.ok) {
          alert("Item added successfully!");
          setItem({ name: "", price: "", category: "", description: "", imageUrl: "" });
          setImageFile(null);
        } else {
          alert(`Error: ${resData.message}`);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Image upload failed");
      }
    } else {
      alert("Please select an image");
    }

    setLoading(false);
  };


  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add New Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={item.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={item.price}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md"
        />

        <select
          name="category"
          value={item.category}
          onChange={handleChange}
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
          value={item.description}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md"
        />
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="w-full p-2 border rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md w-full"
          disabled={loading}
        >
          {loading ? "Adding Item..." : "Add Item"}
        </button>
      </form>
    </div>
  );
};

export default AddItem;
