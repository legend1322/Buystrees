// components/AdminForm.js
"use client";

import { useState } from "react";
import axios from "axios";

export default function AdminForm({ onAdminCreated }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/admin/admins/add", { name, email, password });
      if (response.data.success) {
        onAdminCreated(response.data.admin);
        setName("");
        setEmail("");
        setPassword("");
      } else {
        setError(response.data.error || "Failed to create admin.");
      }
    } catch (err) {
      console.error("Error creating admin:", err);
      setError(err.response?.data?.error || "Failed to create admin. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Create New Admin</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Name</label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">Password</label>
          <input
            type="password"
            id="password"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded-md"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Admin"}
        </button>
      </form>
    </div>
  );
}
