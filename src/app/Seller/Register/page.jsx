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
      const { data } = await axios.post("/api/seller/auth/register", form);
      router.push("/Seller/Login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 bg-gradient-to-br from-indigo-400 via-blue-500 to-purple-500 overflow-hidden">
      {/* White diagonal stripes */}
      <div className="absolute inset-0 z-0 opacity-[50%] [background-image:repeating-linear-gradient(-30deg,_rgba(255,255,255,0.2)_0,_rgba(255,255,255,0.2)_10px,_transparent_20px,_transparent_20px)]" />

      {/* Diagonal "BuyTrees" texts */}
      <div className="absolute w-[120%] flex flex-wrap rotate-[30deg] justify-center items-center text-5xl font-black pointer-events-none select-none z-10">
        {Array.from({ length: 1000 }).map((_, i) => (
          <span
            key={i}
            className="mx-2 text-white opacity-[25%] hover:opacity-80 hover:text-white-100 hover:drop-shadow-[0_0_6px_#a3bffa] transition-all duration-300 pointer-events-auto"
          >
            <div className=" ">BuyTrees Seller</div>
          </span>
        ))}
      </div>

      {/* Registration Form */}
      <form
        onSubmit={handleSubmit}
        className="z-10 bg-white p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center text-indigo-800">
          Create Seller Account
        </h2>

        {error && (
          <div className="text-red-600 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 font-semibold text-white rounded-lg transition duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/Seller/Login"
            className="text-indigo-600 font-medium hover:underline"
          >
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}
