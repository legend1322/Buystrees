"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AdminHeader({ onChangeView }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const router = useRouter();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/Admin/Login");
  };

  useEffect(() => {
    async function fetchAdmin() {
      try {
        const { data } = await axios.get("/api/admin/auth/me");
        if (data.success) {
          setAdmin(data.user);
        } else {
          router.push("/Admin/Login");
        }
      } catch (error) {
        router.push("/Admin/Login");
      }
    }

    fetchAdmin();
  }, []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => onChangeView("dashboard")}
          className="text-2xl font-bold text-green-700"
        >
          BuyTrees Admin
        </button>

        <nav className="hidden md:flex items-center space-x-6">
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="hover:text-green-600 font-medium flex items-center space-x-1"
            >
              <span>Management</span>
              <svg
                className="h-4 w-4 mt-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute top-8 left-0 bg-white border rounded shadow-md w-48 z-10">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onChangeView("sellers");
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Manage Sellers
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onChangeView("categories");
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Manage Categories
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onChangeView("products");
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Manage Products
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onChangeView("orders");
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Manage Orders
                </button>
                {admin?.role === "superadmin" && (
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onChangeView("admins");
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Manage Admins
                  </button>
                )}
              </div>
            )}
          </div>

          {admin && (
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <span className="font-medium">{admin.name}</span>
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${
                  admin.role === "superadmin" ? "bg-yellow-500 text-white" : "bg-blue-500 text-white"
                }`}
              >
                {admin.role}
              </span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="bg-green-600 text-white px-4 py-1 rounded-full hover:bg-green-700 transition text-sm"
          >
            Logout
          </button>
        </nav>

        <button onClick={toggleMenu} className="md:hidden focus:outline-none">
          {menuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3">
          <details className="bg-white border rounded">
            <summary className="px-4 py-2 font-medium cursor-pointer">Management</summary>
            <div className="px-4 pb-2 space-y-2">
              <button
                onClick={() => {
                  onChangeView("sellers");
                  setMenuOpen(false);
                }}
                className="block text-left w-full text-sm hover:text-green-600"
              >
                Manage Sellers
              </button>
              <button
                onClick={() => {
                  onChangeView("categories");
                  setMenuOpen(false);
                }}
                className="block text-left w-full text-sm hover:text-green-600"
              >
                Manage Categories
              </button>
              <button
                onClick={() => {
                  onChangeView("products");
                  setMenuOpen(false);
                }}
                className="block text-left w-full text-sm hover:text-green-600"
              >
                Manage Products
              </button>
              <button
                onClick={() => {
                  onChangeView("orders");
                  setMenuOpen(false);
                }}
                className="block text-left w-full text-sm hover:text-green-600"
              >
                Manage Orders
              </button>
              {admin?.role === "superadmin" && (
                <button
                  onClick={() => {
                    onChangeView("admins");
                    setMenuOpen(false);
                  }}
                  className="block text-left w-full text-sm hover:text-green-600"
                >
                  Manage Admins
                </button>
              )}
            </div>
          </details>

          {admin && (
            <div className="text-sm px-2 text-gray-700">
              <p className="font-medium">{admin.name}</p>
              <p
                className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                  admin.role === "superadmin" ? "bg-yellow-500 text-white" : "bg-blue-500 text-white"
                }`}
              >
                {admin.role}
              </p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="block text-left w-full text-sm text-red-600 mt-3"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
