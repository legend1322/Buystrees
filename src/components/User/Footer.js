"use client";
import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer id="contact" className="bg-green-400  text-white py-6 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-2">BuyTrees</h3>
            <p className="text-sm">
              Your one-stop shop for buying and planting trees to create a greener world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/Shop" className="hover:underline">Home</Link>
              </li>
              <li>
                <Link href="/Shop/About" className="hover:underline">About</Link>
              </li>
              <li>
                <Link href="/Shop/Products" className="hover:underline">Products</Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold mb-2">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: support@buytrees.com</li>
              <li>Phone: +91 62808-94854</li>
              <li>Address: Amritsar, Panjab, India</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-bold mb-2">Follow Us</h3>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Facebook">
                <svg
                  className="w-6 h-6 hover:text-gray-200"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12a10 10 0 1 0-11.64 9.87v-6.99h-2.77v-2.88h2.77V9.44c0-2.74 1.64-4.24 4.13-4.24 1.2 0 2.45.2 2.45.2v2.7h-1.38c-1.36 0-1.78.85-1.78 1.72v2.07h3.03l-.48 2.88h-2.55v6.99A10 10 0 0 0 22 12z" />
                </svg>
              </Link>
              <Link href="#" aria-label="Twitter">
                <svg
                  className="w-6 h-6 hover:text-gray-200"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.56a9.94 9.94 0 0 1-2.83.77 4.94 4.94 0 0 0 2.17-2.73 9.88 9.88 0 0 1-3.13 1.2 4.92 4.92 0 0 0-8.39 4.48 13.94 13.94 0 0 1-10.13-5.14 4.92 4.92 0 0 0 1.52 6.57A4.92 4.92 0 0 1 .96 8v.06a4.93 4.93 0 0 0 3.95 4.83 4.93 4.93 0 0 1-2.23.08 4.92 4.92 0 0 0 4.6 3.42A9.87 9.87 0 0 1 0 19.54 13.94 13.94 0 0 0 7.56 22c9.14 0 14.14-7.57 14.14-14.14 0-.21 0-.42-.02-.63a10.12 10.12 0 0 0 2.32-2.57z" />
                </svg>
              </Link>
              <Link href="#" aria-label="Instagram">
                <svg
                  className="w-6 h-6 hover:text-gray-200"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.16c3.2 0 3.58 0 4.85.07 1.22.06 2.03.26 2.5.44a5 5 0 0 1 1.75 1.1 5 5 0 0 1 1.1 1.75c.18.47.38 1.28.44 2.5.07 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.06 1.22-.26 2.03-.44 2.5a5 5 0 0 1-1.1 1.75 5 5 0 0 1-1.75 1.1c-.47.18-1.28.38-2.5.44-1.27.07-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.22-.06-2.03-.26-2.5-.44a5 5 0 0 1-1.75-1.1 5 5 0 0 1-1.1-1.75c-.18-.47-.38-1.28-.44-2.5C2.16 15.58 2.16 15.2 2.16 12s0-3.58.07-4.85c.06-1.22.26-2.03.44-2.5A5 5 0 0 1 3.77 3.9a5 5 0 0 1 1.75-1.1c.47-.18 1.28-.38 2.5-.44 1.27-.07 1.65-.07 4.85-.07zm0 1.7c-3.16 0-3.52 0-4.74.06-1.01.05-1.58.22-1.95.37a3.31 3.31 0 0 0-1.21.74 3.31 3.31 0 0 0-.74 1.21c-.15.37-.32.94-.37 1.95-.06 1.22-.06 1.58-.06 4.74s0 3.52.06 4.74c.05 1.01.22 1.58.37 1.95.15.37.34.67.55.87.21.2.5.4.87.55.37.15.94.32 1.95.37 1.22.06 1.58.06 4.74.06s3.52 0 4.74-.06c1.01-.05 1.58-.22 1.95-.37a3.31 3.31 0 0 0 1.21-.74 3.31 3.31 0 0 0 .74-1.21c.15-.37.32-.94.37-1.95.06-1.22.06-1.58.06-4.74s0-3.52-.06-4.74c-.05-1.01-.22-1.58-.37-1.95a3.31 3.31 0 0 0-.74-1.21 3.31 3.31 0 0 0-1.21-.74c-.37-.15-.94-.32-1.95-.37-1.22-.06-1.58-.06-4.74-.06zm0 3.73a4.15 4.15 0 1 1 0 8.3 4.15 4.15 0 0 1 0-8.3zm0 1.7a2.45 2.45 0 1 0 0 4.9 2.45 2.45 0 0 0 0-4.9zm3.41-3.36a.99.99 0 1 1 0-1.98.99.99 0 0 1 0 1.98z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center text-sm">
          © {new Date().getFullYear()} BuyTrees. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
