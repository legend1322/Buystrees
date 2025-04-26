"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductCard({ product, onEdit, onDelete }) {
    const images = product.images?.length ? product.images : ["/placeholder.png"];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showDescription, setShowDescription] = useState(false);

    const handleRowClick = (e) => {
        if (e.target.tagName !== "BUTTON") {
            setShowDescription((prev) => !prev);
        }
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    return (
        <div className="border-b border-gray-200 text-[10px] sm:text-sm">
            <div
                onClick={handleRowClick}
                className="grid grid-cols-6 py-2 hover:bg-gray-50 transition cursor-pointer"
            >
                <div className="p-2 border-2 text-center">{product.name}</div>
                <div className="p-2 border-2 text-right slashed-zero tabular-nums">₹{product.price}</div>
                <div className="p-2 border-2 text-right slashed-zero tabular-nums">{product.stock}</div>
                <div className="p-2 border-2 text-center">{product.category}</div>

                <div className="p-2 border-2 text-center">
                    <span
                        className={`px-2 py-[1px] rounded font-semibold ${
                            product.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }`}
                    >
                        {product.status}
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 p-1 border-2 text-center">
                    <div className="m-1 border-2 flex-1">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit();
                            }}
                            className="text-yellow-600 hover:underline w-full"
                        >
                            Edit
                        </button>
                    </div>

                    <div className="m-1 border-2 flex-1">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                            className="text-red-600 hover:underline w-full"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            {showDescription && (
                <div className="bg-gray-50 px-4 py-4 text-gray-700 text-xs sm:text-sm animate-fadeIn">
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                        {/* Image Carousel */}
                        <div className="flex flex-col items-center gap-1 min-w-[80px]">
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 border-2 border-gray-200 rounded overflow-hidden">
                                <Image
                                    src={images[currentImageIndex]}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 640px) 80px, 96px"
                                    className="object-cover"
                                />
                            </div>

                            {images.length > 1 && (
                                <div className="flex items-center gap-1 mt-1">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            prevImage();
                                        }}
                                        className="text-[10px] px-1 rounded bg-gray-200 hover:bg-gray-300"
                                    >
                                        ◀
                                    </button>
                                    <span className="text-[10px] text-gray-600">
                                        {currentImageIndex + 1}/{images.length}
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            nextImage();
                                        }}
                                        className="text-[10px] px-1 rounded bg-gray-200 hover:bg-gray-300"
                                    >
                                        ▶
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-700 mb-1">Product Description</h4>
                            <p>{product.description || "No description available."}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
