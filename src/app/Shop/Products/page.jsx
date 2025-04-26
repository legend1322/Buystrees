"use client";

import ProductCard from "@/components/shop/ProductCard";
import { useEffect, useState } from "react";
import { useAuth } from "@/utils/client/AuthContext";

export default function Products() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState(""); // NEW
  const [categories, setCategories] = useState([]); // NEW
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 12;

  // Fetch all product categories (NEW)
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/shop/categories");
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    let url = `/api/shop/products?search=${encodeURIComponent(search)}&sort=${sort}&page=${page}&limit=${limit}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchCategories(); // NEW
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, sort, page, category]); // Include category here

  return (
    <div className="p-4">
      {/* Search, Sort & Category Filter */}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="border p-2 rounded w-full md:w-1/3"
        />

        <select
          value={category}
          onChange={(e) => {
            setPage(1);
            setCategory(e.target.value);
          }}
          className="border p-2 rounded w-full md:w-1/4"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2 rounded w-full md:w-1/5"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={{
              _id: product._id,
              name: product.name,
              description: product.description,
              image: product.images[0],
              price: `₹${product.price}`,
            }}
            userId={user?._id}
            isGridView={true}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: Math.ceil(total / limit) }, (_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded ${page === i + 1 ? "bg-black text-white" : "bg-gray-200"}`}
            onClick={() => setPage(i + 1)}
            disabled={page === i + 1}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
