"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProfileSlideIn from "@/components/User/ProfileSlideIn";
import { motion } from "framer-motion";
import { useAuth } from "@/utils/client/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const { user, isLoggedIn, isLoading, profileImage, logout } = useAuth();
  const router = useRouter();

  const handleProfileClick = () => setShowProfile(true);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      router.push("/Shop");
      router.refresh();
    }
  };

  if (isLoading) {
    return (
      <nav className="bg-white border-b-4 border-l-8 border-green-400 shadow-md">
        <div className="text-center bg-green-400 text-white font-bold text-2xl py-2">BuyTrees</div>
        <div className="flex justify-center p-4">
          <div className="animate-pulse">Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 z-50 bg-white w-full border-b-4 border-l-8 border-green-400 shadow-md">
      <div className="text-center bg-green-400 text-white font-bold text-2xl py-1 md:rounded-tr-[10px]">
        BuyTrees
      </div>

      <div className="hidden md:flex max-w-7xl mx-auto px-6 py-2 justify-between items-center">
        <div className="flex space-x-6 text-green-400 items-center">
          <Link href="/Shop" className="hover:text-gray-500">Home</Link>
          <a href="/Shop/About" className="hover:text-gray-500">About</a>
          <Link href="/Shop/Products" className="hover:text-gray-500">Products</Link>
          <Link href="#contact" className="hover:text-gray-500">Contact</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/Shop/Cart" className="block hover:bg-green-400 hover:text-white rounded px-3 py-2">
            🛒 Cart
          </Link>

          {isLoggedIn ? (
            <>
              <motion.button
                onClick={handleProfileClick}
                className="flex items-center gap-2 hover:text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src={profileImage}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full object-cover border border-green-400"
                />
                <span className="text-sm">{user.name}</span>
              </motion.button>

              <motion.button
                onClick={handleLogout}
                className="text-sm px-3 py-1 border border-green-400 rounded hover:bg-green-400 hover:text-white"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                Logout
              </motion.button>
            </>
          ) : (
            <Link href="/Shop/User/Login" className="hover:text-gray-500">Login</Link>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex justify-between items-center px-4 py-3 text-green-400">
        <div className="flex items-center space-x-2">
          {isLoggedIn && (
            <button onClick={handleProfileClick} className="flex items-center space-x-2">
              <Image
                src={profileImage}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full object-cover border border-green-400"
              />
              <span className="text-sm">{user.name}</span>
            </button>
          )}
        </div>

        <motion.button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </motion.button>
      </div>

      {isMenuOpen && (
        <motion.div
          className="md:hidden bg-white px-4 py-2 space-y-1 text-green-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/Shop" className="block hover:bg-green-400 hover:text-white rounded px-3 py-2">Home</Link>
          <Link href="/Shop/About" className="block hover:bg-green-400 hover:text-white rounded px-3 py-2">About</Link>
          <Link href="/Shop/Products" className="block hover:bg-green-400 hover:text-white rounded px-3 py-2">Products</Link>
          <Link href="#" className="block hover:bg-green-400 hover:text-white rounded px-3 py-2">Contact</Link>
          <Link href="/Shop/Cart" className="block hover:bg-green-400 hover:text-white rounded px-3 py-2">🛒 Cart</Link>

          {isLoggedIn ? (
            <>
              <button onClick={handleProfileClick} className="block w-full text-left hover:bg-green-400 hover:text-white rounded px-3 py-2">Profile</button>
              <button onClick={handleLogout} className="block w-full text-left hover:bg-green-400 hover:text-white rounded px-3 py-2">Logout</button>
            </>
          ) : (
            <Link href="/Shop/User/Login" className="block hover:bg-green-400 hover:text-white rounded px-3 py-2">Login</Link>
          )}
        </motion.div>
      )}

      <ProfileSlideIn 
        user={user}
        isVisible={showProfile}
        onClose={() => setShowProfile(false)}
        className=""
      />
    </nav>
  );
};

export default Header;
