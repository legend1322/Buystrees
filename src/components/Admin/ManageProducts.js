import { useEffect, useState } from "react";
import axios from "axios";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/admin/products");
      setProducts(res.data.products);
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`/api/admin/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete product.");
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-2">Manage Products</h1>
      <p className="text-gray-600 mb-6">View, edit, or remove products listed by sellers.</p>

      {loading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-md">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Product</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Category</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Price</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Stock</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Seller</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">₹{product.price}</td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4">
                    {product.seller?.name}
                    <br />
                    <span className="text-xs text-gray-400">{product.seller?.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full text-white ${
                        product.status === "active" ? "bg-green-500" : "bg-gray-400"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
