"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SellerHeader() {
  const router = useRouter();
  const [seller, setSeller] = useState(null);

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const res = await fetch("/api/seller/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          router.push("/Seller/Login");
          return;
        }

        const data = await res.json();

        if (!data?.seller?._id) {
          router.push("/Seller/Login");
          return;
        }

        setSeller(data.seller);
      } catch (error) {
        console.error("Fetch seller error:", error);
        router.push("/Seller/Login");
      }
    };

    fetchSeller();
  }, [router]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/seller/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Logout failed");

      localStorage.removeItem("token");
      router.push("/Seller/Login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-green-700">BuyTrees Seller</h1>
          {seller && (
            <div className="text-sm text-gray-600">
              <p className="font-medium">Welcome, {seller.name}</p>
              <p>
                Status:{" "}
                <span className={`font-semibold ${seller.status === "active" ? "text-green-600" : "text-red-500"}`}>
                  {seller.status.charAt(0).toUpperCase() + seller.status.slice(1)}
                </span>
              </p>
            </div>
          )}
        </div>
        <nav className="flex items-center gap-4">
          <a href="/Seller/Dashboard" className="text-gray-700 hover:text-green-600 transition">Home</a>
          <a href="/Seller/Dashboard/Products" className="text-gray-700 hover:text-green-600 transition">Products</a>
          <a href="/Seller/Dashboard/Orders" className="text-gray-700 hover:text-green-600 transition">Orders</a>
          <a href="/Shop" className="text-gray-700 hover:text-green-600 transition">Shop</a>

          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 font-medium transition"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
