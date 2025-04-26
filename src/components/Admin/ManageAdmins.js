"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AdminForm from "@/components/Admin/adminForm";

export default function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState({});
  const [showForm, setShowForm] = useState(false); // 🆕 form toggle state

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const { data } = await axios.get("/api/admin/admins", {
          withCredentials: true,
        });
        setAdmins(data);
      } catch (err) {
        console.error("Error fetching admins:", err);
        setError(
          err.response?.data?.error || "Failed to load admins. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;
    setDeleting((prev) => ({ ...prev, [id]: true }));

    try {
      const { data } = await axios.delete(`/api/admin/admins/${id}`, {
        withCredentials: true,
      });

      setAdmins((prev) => prev.filter((admin) => admin._id !== id));
    } catch (err) {
      console.error("Error deleting admin:", err);
      alert(
        err.response?.data?.error || "Failed to delete admin. Please try again."
      );
    } finally {
      setDeleting((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleAdminCreated = (newAdmin) => {
    setAdmins((prev) => [newAdmin, ...prev]);
    setShowForm(false); // close form after creation ✅
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Manage Admins</h1>
      <p className="text-gray-600 mb-6">
        Add or remove admins. Only accessible to superadmins.
      </p>

      <button
        onClick={() => setShowForm((prev) => !prev)}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {showForm ? "Cancel" : "Add Admin"}
      </button>

      {showForm && (
        <div className="mb-6">
          <AdminForm onAdminCreated={handleAdminCreated} />
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading admins...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : admins.length === 0 ? (
        <p className="text-gray-500">No other admins found.</p>
      ) : (
        <div className="grid gap-4">
          {admins.map((admin) => (
            <div
              key={admin._id}
              className="p-4 border border-gray-200 rounded bg-white shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{admin.name}</p>
                <p className="text-sm text-gray-600">{admin.email}</p>
                <p className="text-sm text-gray-500">Role: {admin.role}</p>
              </div>

              <button
                onClick={() => handleDelete(admin._id)}
                disabled={deleting[admin._id]}
                className="text-red-600 hover:underline text-sm"
              >
                {deleting[admin._id] ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
