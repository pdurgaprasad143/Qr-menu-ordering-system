import React from "react";

const MenuCategory = ({ categories, selectedCategory, setSelectedCategory }) => {
  console.log(selectedCategory);
  return (
    <div className="flex overflow-x-auto mb-8 pb-2 -mx-4 px-4 md:px-0">
      <div className="flex space-x-4">
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => setSelectedCategory(category._id)} // Use ID
            className={`whitespace-nowrap px-4 py-2 rounded-full ${
              selectedCategory === category._id
                ? "bg-orange-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuCategory;
