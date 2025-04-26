"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/shop/ProductCard";
import { useAuth } from "@/utils/client/AuthContext";

export default function CardSlider({ category }) {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState(category || "Pots");
  const [loading, setLoading] = useState(false);

  // Update category when prop changes
  useEffect(() => {
    if (category) setFilteredCategory(category);
  }, [category]);

  // Fetch categories (optional)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/shop/categories");
        const data = await res.json();
        if (data.success) setCategories(data.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products based on selected category
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/api/shop/products?page=1&limit=20&sort=newest&category=${encodeURIComponent(
          filteredCategory
        )}`;

        const res = await fetch(url);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (filteredCategory) fetchProducts();
  }, [filteredCategory]);

  return (
    <div className="p-6">
      <h2 className="w-full text-center text-white rounded-lg bg-green-400 text-2xl font-semibold mb-6">
        {filteredCategory}
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">
          No products found in {filteredCategory} category.
        </p>
      ) : (
        <div className="flex overflow-x-auto gap-4 pb-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="min-w-[300px] max-w-[300px] flex-shrink-0"
            >
              <ProductCard
                product={{
                  _id: product._id,
                  name: product.name,
                  description: product.description,
                  image: product.images?.[0],
                  price: `₹${product.price}`,
                }}
                userId={user?._id}
                isGridView={true}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
