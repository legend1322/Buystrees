"use client";
import { addToCart } from "@/utils/shop/addToCart";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Product({ initialProduct }) {
  const [product] = useState(initialProduct);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [message, setMessage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  if (!product) return <p className="p-4">Product not found.</p>;

  const addToCartHandler = async () => {
    if (product.stock <= 0) return;

    try {
      setIsAddingToCart(true);

      // Use the imported addToCart utility
      const updatedCart = await addToCart({
        productId: product._id,
        quantity: 1,
      });

      setMessage({ type: "success", text: "Added to cart successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsAddingToCart(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const buyNow = async () => {
    await addToCartHandler();
    router.push("/Shop/checkout");
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleSwipe = (direction) => {
    if (direction === "left") {
      nextImage();
    } else if (direction === "right") {
      prevImage();
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto relative">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Images Section */}
        <div className="flex gap-4">
          {/* Vertical Carousel */}
          {product.images?.length > 1 && (
            <div className="flex flex-col items-center">
              <button
                onClick={prevImage}
                className="text-gray-600 hover:text-black"
              >
                ▲
              </button>

              <div className="relative h-40 w-16 flex flex-col items-center justify-center overflow-hidden">
                {product.images.map((img, i) => {
                  const diff = i - currentImageIndex;
                  const opacity =
                    diff === 0 ? "opacity-100" : diff === -1 || diff === 1 ? "opacity-40" : "opacity-0";
                  const translate =
                    diff === 0
                      ? "translate-y-0 scale-100"
                      : diff === -1
                      ? "-translate-y-16 scale-75"
                      : diff === 1
                      ? "translate-y-16 scale-75"
                      : "hidden";

                  return (
                    <div
                      key={i}
                      className={`absolute transition-all duration-300 ease-in-out ${opacity} ${translate}`}
                      onClick={() => setCurrentImageIndex(i)}
                    >
                      <Image
                        src={img}
                        alt={`Thumb ${i + 1}`}
                        width={56}
                        height={56}
                        className="rounded cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>

              <button
                onClick={nextImage}
                className="text-gray-600 hover:text-black"
              >
                ▼
              </button>
            </div>
          )}

          {/* Main Image with Framer Motion swipe support */}
          <motion.div
            className="relative w-full h-80"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(event, info) => {
              if (info.offset.x < -50) {
                handleSwipe("left");
              } else if (info.offset.x > 50) {
                handleSwipe("right");
              }
            }}
          >
            <Image
              src={product.images[currentImageIndex]}
              alt={`${product.name} ${currentImageIndex + 1}`}
              fill
              className="object-cover rounded-lg transition-opacity duration-300"
              priority
            />
            {product.images.length > 1 && (
              <div className="absolute bottom-2 right-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                Image {currentImageIndex + 1} of {product.images.length}
              </div>
            )}
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-2 text-white text-xl bg-black bg-opacity-50 px-2 py-1 rounded"
            >
              ❮
            </button>
            <button
              onClick={nextImage}
              className="absolute top-1/2 right-2 text-white text-xl bg-black bg-opacity-50 px-2 py-1 rounded"
            >
              ❯
            </button>
          </motion.div>
        </div>

        {/* Details */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-lg font-semibold mb-4">₹{product.price}</p>
          {product.stock > 0 ? (
            <p className="text-green-600 mb-4">In Stock: {product.stock}</p>
          ) : (
            <p className="text-red-500 mb-4">Out of Stock</p>
          )}

                {/* ✅ Notification Message */}
          {message && (
            <div
              className={` text-sm px-4 py-2 rounded shadow-md mb-4 ${
                message.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}


          <div className="flex space-x-4">
            <button
              onClick={addToCartHandler}
              disabled={isAddingToCart || product.stock <= 0}
              className={`px-4 py-2 rounded font-medium transition-all duration-300 ${
                product.stock <= 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </button>

            <button
              onClick={buyNow}
              disabled={isAddingToCart || product.stock <= 0}
              className={`px-4 py-2 rounded font-medium transition-all duration-300 ${
                product.stock <= 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Buy Now
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Category: {product.category}
          </p>
        </div>
      </div>
    </div>
  );
}
