"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ProductForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState(initialData || {
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    status: "active",
    images: [],
  });

  const [categories, setCategories] = useState([]);

  // Fetch categories from API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
        } else {
          console.error("Failed to load categories.");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }

    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + formData.images.length > 7) {
      alert("You can only upload up to 7 images.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...selectedFiles].slice(0, 7),
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 p-4 md:p-6 border rounded shadow-sm max-w-3xl mx-auto"
    >
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? "Edit Product" : "Add Product"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <select
          required
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Price"
          required
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Stock"
          required
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <textarea
        placeholder="Description"
        required
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full border p-2 rounded mt-4"
        rows={4}
      ></textarea>

      <div className="mt-4">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border p-2 rounded"
        />
        <p className="text-sm text-gray-600 mt-1">Max 7 images</p>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {formData.images.map((image, index) => {
          const imageUrl = typeof image === "string" ? image : URL.createObjectURL(image);
          return (
            <div key={index} className="relative w-20 h-20 border rounded overflow-hidden">
              <Image
                src={imageUrl}
                alt={`Preview ${index}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl"
              >
                X
              </button>
            </div>
          );
        })}
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white w-full md:w-auto px-6 py-2 rounded mt-6 hover:bg-green-700 transition"
      >
        {initialData ? "Update" : "Add"} Product
      </button>
    </form>
  );
}
