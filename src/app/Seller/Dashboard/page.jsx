"use client";

import SellerHeader from "@/components/Seller/SellerHeader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Profile = () => {
  const [seller, setSeller] = useState(null);
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState("/images/seller/agent.png"); // Default avatar
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const res = await fetch("/api/seller/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch profile");

        setSeller(data.seller);
        setForm({ name: data.seller.name, email: data.seller.email });
        if (data.seller.profileImage) setProfileImage(`${data.seller.profileImage}?t=${Date.now()}`);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSeller();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/seller/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      setSeller(data.seller);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !seller) return;

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const res = await fetch("/api/seller/auth/me", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      setSeller(data.seller);
      setProfileImage(`${data.seller.profileImage}?t=${Date.now()}`);
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

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

  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!seller) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
    
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg text-center">
      <div className="relative">
        <img
          src={profileImage}
          alt="Profile"
          className="w-32 h-32 mx-auto rounded-full border-4 border-gray-300 shadow-md"
        />
        <label className="absolute bottom-2 right-6 bg-blue-500 text-white p-2 rounded-full cursor-pointer shadow-md">
          📷
          <input type="file" className="hidden" onChange={handleImageUpload} />
        </label>
      </div>

      <form onSubmit={handleUpdate} className="mt-4 space-y-4">
        <div>
          <label className="block text-left font-medium">Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-left font-medium">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>

      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="p-6">
            <h1 className="text-2xl font-bold">Seller Dashboard</h1>
            <div className="mt-4">
                <Link href="/Seller/Dashboard/Products" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Manage Products
                </Link>
            </div>
        </div>
    </div>

    </>   
    
  );
};

export default Profile;
