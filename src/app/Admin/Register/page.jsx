"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data } = await axios.post("/api/admin/auth/register", form, {
        headers: { "Content-Type": "application/json" },
      });

      router.push("/Admin/Login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          BuyTrees Admin Register
        </h2>

        {error && (
          <p className="text-red-600 text-center text-sm mb-4">{error}</p>
        )}

        <div className="space-y-5">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Full Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Email</label>
            <input
              type="email"
              placeholder="admin@gmail.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-medium rounded-lg transition duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <a
            href="/Admin/Login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
