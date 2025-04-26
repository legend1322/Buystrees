"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data } = await axios.post("/api/seller/auth/login", form, {
        headers: { "Content-Type": "application/json" },
      });

      router.push("/Seller/Dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 bg-gradient-to-br from-teal-400 via-cyan-400 to-emerald-400 overflow-hidden">
      {/* White diagonal stripes */}
      <div className="absolute inset-0 z-0 opacity-[50%] [background-image:repeating-linear-gradient(-30deg,_rgba(255,255,255,0.2)_0,_rgba(255,255,255,0.2)_10px,_transparent_20px,_transparent_20px)]" />

      {/* Diagonal "BuyTrees Seller" texts with glow on hover */}
      <div className="absolute w-[120%] flex flex-wrap rotate-[30deg] justify-center items-center text-5xl font-black pointer-events-none select-none z-10">
        {Array.from({ length: 1000 }).map((_, i) => (
          <span
            key={i}
            className="mx-2 text-white opacity-[25%] transition-all duration-300 pointer-events-auto hover:opacity-90 hover:text-white hover:drop-shadow-[0_0_10px_#bbf7d0]"
          >
            BuyTrees Seller
          </span>
        ))}
      </div>

      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        className="z-20 bg-white p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center text-teal-800">
          Seller Login
        </h2>

        {error && (
          <div className="text-red-600 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 font-semibold text-white rounded-lg transition duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-teal-500 to-cyan-500 hover:opacity-90"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a
            href="/Seller/Register"
            className="text-teal-600 font-medium hover:underline"
          >
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
