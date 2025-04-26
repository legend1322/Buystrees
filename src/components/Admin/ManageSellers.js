"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ManageSellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSellers = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get("/api/admin/sellers");
      if (data.success) {
        setSellers(data.sellers);
      } else {
        setError("Failed to fetch sellers.");
      }
    } catch (err) {
      setError("Something went wrong while fetching sellers.");
    }
    setLoading(false);
  };

  const handleToggleStatus = async (sellerId, currentStatus) => {
    const nextStatus =
      currentStatus === "approved"
        ? "verified"
        : currentStatus === "verified"
        ? "banned"
        : "approved";

    try {
      const { data } = await axios.put(`/api/admin/sellers/${sellerId}`, {
        status: nextStatus,
      });

      if (data.success) {
        setSellers((prev) =>
          prev.map((seller) =>
            seller._id === sellerId ? { ...seller, status: data.seller.status } : seller
          )
        );
      } else {
        alert("Failed to update seller status.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating seller status.");
    }
  };

  const handleDeleteSeller = async (sellerId) => {
    if (window.confirm("Are you sure you want to delete this seller?")) {
      try {
        const { data } = await axios.delete(`/api/admin/sellers/${sellerId}`);
        if (data.success) {
          setSellers((prev) => prev.filter((seller) => seller._id !== sellerId));
        } else {
          alert("Failed to delete seller.");
        }
      } catch (err) {
        console.error(err);
        alert("Error deleting seller.");
      }
    }
  };

  const handleViewProfile = async (sellerId) => {
    try {
      const { data } = await axios.get(`/api/admin/sellers/${sellerId}`);
      if (data.success) {
        alert(
          `Seller: ${data.seller.name}\nEmail: ${data.seller.email}\nStatus: ${data.seller.status}\nLast Active: ${new Date(
            data.lastActiveAt
          ).toLocaleString()}`
        );
      } else {
        alert("Failed to fetch seller profile.");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching seller profile.");
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Manage Sellers</h1>
      <p className="text-gray-600 mb-4">
        Here you can view, verify, ban/unban, or delete sellers.
      </p>

      {loading ? (
        <p className="text-gray-500">Loading sellers...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : sellers.length === 0 ? (
        <p className="text-gray-500">No sellers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => (
                <tr key={seller._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{seller.name}</td>
                  <td className="px-4 py-2 border">{seller.email}</td>
                  <td className="px-4 py-2 border">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        seller.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : seller.status === "verified"
                          ? "bg-blue-100 text-blue-700"
                          : seller.status === "banned"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {seller.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">
                    <div className="space-x-2">
                      <button
                        onClick={() => handleViewProfile(seller._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleToggleStatus(seller._id, seller.status)}
                        className={`text-sm px-3 py-1 rounded ${
                          seller.status === "approved"
                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                            : seller.status === "verified"
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                      >
                        {seller.status === "approved"
                          ? "Verify"
                          : seller.status === "verified"
                          ? "Ban"
                          : "Approve"}
                      </button>

                      <button
                        onClick={() => handleDeleteSeller(seller._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
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
