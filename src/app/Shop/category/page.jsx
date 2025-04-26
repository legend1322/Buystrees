'use client';

import { useEffect, useState } from 'react';

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/shop/categories');
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : categories.length > 0 ? (
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category._id} className="bg-white shadow rounded-xl p-4 border">
              <span className="text-lg">{category.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No categories found.</p>
      )}
    </div>
  );
}
