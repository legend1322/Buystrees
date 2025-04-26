"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch categories from the server
  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get("/api/admin/categories");
      if (data.success) {
        setCategories(data.categories);
      } else {
        setError("Failed to fetch categories.");
      }
    } catch (err) {
      setError("Something went wrong while fetching categories.");
    }
    setLoading(false);
  };

  // Add a new category
  const handleAddCategory = async () => {
    if (!newCategoryName) return;
    try {
      const { data } = await axios.post("/api/admin/categories", { name: newCategoryName });
      if (data.success) {
        setCategories((prev) => [...prev, data.category]);
        setNewCategoryName("");
      } else {
        alert("Failed to add category.");
      }
    } catch (err) {
      alert("Error adding category.");
    }
  };

  // Delete a category
  const handleDeleteCategory = async (categoryId) => {
    try {
      const { data } = await axios.delete(`/api/admin/categories/${categoryId}`);
      if (data.success) {
        setCategories((prev) => prev.filter((category) => category._id !== categoryId));
        setSelectedCategory(null);
      } else {
        alert("Failed to delete category.");
      }
    } catch (err) {
      alert("Error deleting category.");
    }
  };

  // Select a category
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Manage Categories</h1>
      <p className="text-gray-600 mb-4">Add, update, or delete product categories.</p>

      {loading ? (
        <p className="text-gray-500">Loading categories...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="mb-4">
            <input
              type="text"
              placeholder="New Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="border p-2 rounded mr-2"
            />
            <button
              onClick={handleAddCategory}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Category
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 shadow-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2 border">Category Name</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{category.name}</td>
                    <td className="px-4 py-2 border">
                      <button
                        onClick={() => handleCategorySelect(category)}
                        className="bg-yellow-500 text-white px-4 py-1 rounded mr-2"
                      >
                        Manage
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="bg-red-500 text-white px-4 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedCategory && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Managing {selectedCategory.name}</h2>
              <p className="text-gray-600 mb-4">You can edit or delete this category.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
