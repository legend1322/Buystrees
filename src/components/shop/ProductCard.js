"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addToCart } from "@/utils/shop/addToCart";

const ProductCard = ({ product, isGridView, userId }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [notification, setNotification] = useState(null); // ✅ For custom notifications
  const router = useRouter();

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart({ productId: product._id, quantity: 1 });
      showNotification("Product added to cart!", "success");
    } catch (error) {
      showNotification(error.message || "Failed to add to cart.", "error");
    } finally {
      setIsAdding(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000); // Auto-hide after 3 seconds
  };

  const handleBuyNow = async () => {
    if (!userId) {
      showNotification("Please log in to continue", "error");
      setTimeout(() => {
        router.push("/Shop/User/Login");
      }, 1000); // brief delay for the message to show
      return;
    }
  
    setIsAdding(true);
    try {
      await addToCart({ productId: product._id, quantity: 1 });
      router.push("/Shop/checkout");
    } catch (error) {
      showNotification(error.message || "Failed to add to cart.", "error");
    } finally {
      setIsAdding(false);
    }
  };
  

  return (
    <div
      className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl ${
        isGridView ? "" : "max-w-md mx-auto"
      }`}
    >
      {/* ✅ Notification Message placed above the buttons */}
      {notification && (
        <div
          className={`absolute top-2 left-2 z-20 text-sm px-3 py-1 rounded-full shadow-md mb-4 ${
            notification.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {notification.message}
        </div>
      )}

      <Link href={`/Shop/Products/${product._id}`}>
        <div className="relative w-full h-64 overflow-hidden group cursor-pointer">
          <Image
            src={product.image}
            alt={product.name}
            width={500}
            height={500}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </Link>

      <div className="p-4 space-y-2">
        <Link href={`/Shop/Products/${product._id}`}>
          <h3 className="text-xl font-bold text-gray-800 line-clamp-1 cursor-pointer hover:underline">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold text-green-600">{product.price}</span>
          <div className="space-x-2">
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-xl transition-all duration-300 shadow hover:shadow-md"
            >
              {isAdding ? "Adding..." : "Add to Cart"}
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-xl transition-all duration-300 shadow hover:shadow-md"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
