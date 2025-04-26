"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductForm from "@/components/Seller/productForm";
import ProductCard from "@/components/Seller/ProductCard";

export default function SellerProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);

    useEffect(() => {
        fetchProducts();
    }, [search, sortField, sortOrder, page, limit]);

    async function fetchProducts() {
        setLoading(true);
        try {
            const res = await fetch(
                `/api/seller/products?search=${search}&sort=${sortField}&order=${sortOrder}&page=${page}&limit=${limit}`
            );
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error("Failed to fetch products:", err);
        } finally {
            setLoading(false);
        }
    }

    function handleAddNew() {
        setEditingProduct(null);
        setShowModal(true);
    }

    async function handleSubmit(formData) {
        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === "images") {
                value.forEach((file) => form.append("images", file));
            } else {
                form.append(key, value);
            }
        });

        const isEditing = !!editingProduct;
        const url = isEditing
            ? `/api/seller/products/${editingProduct._id}`
            : "/api/seller/products";

        const method = isEditing ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                body: form,
            });

            if (res.ok) {
                fetchProducts();
                setShowModal(false);
                setEditingProduct(null);
            } else {
                console.error("Failed to submit product");
            }
        } catch (err) {
            console.error("Submit error:", err);
        }
    }

    async function handleDeleteProduct(productId) {
        const confirmDelete = confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`/api/seller/products/${productId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                fetchProducts();
            } else {
                console.error("Failed to delete product");
            }
        } catch (err) {
            console.error("Delete error:", err);
        }
    }

    return (
        <div className="p-4">

            <div><h1 className="text-2xl font-bold mb-4">Your Products</h1></div>

            <div className="mt-4">
                <Link href="/Seller/Dashboard/" className="bg-blue-600 text-white px-4 py-2 rounded">
                     Profile
                </Link>
            </div>
            
            {/* Toolbar */}
            <section className="mb-4 ">
                
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-end ">
                
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                    }}
                    className="border p-2 rounded w-full sm:w-48"
                />

                <select
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
                    className="border p-2 rounded w-full sm:w-36"
                >
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                    <option value="stock">Stock</option>
                </select>

                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="border p-2 rounded w-full sm:w-36"
                >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>

                <select
                    value={limit}
                    onChange={(e) => {
                    setLimit(parseInt(e.target.value));
                    setPage(1);
                    }}
                    className="border p-2 rounded w-full sm:w-40"
                >
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                    <option value="100">100 per page</option>
                </select>

                <button
                    onClick={handleAddNew}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    Add New
                </button>

                </div>

            </section>

            <section className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                {/* Table Head */}
                <div className="grid grid-cols-6 border-4 gap-1 text-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    <div className="border-2 ">Name</div>
                    <div className="border-2 ">Price</div>
                    <div className="border-2 ">Stock</div>
                    <div className="border-2 ">Category</div>
                    <div className="border-2 ">Status</div>
                    <div className="border-2 ">Action</div>
                </div>

                {/* Product Rows */}
                {loading ? (
                    <div className="text-center text-gray-500 p-4 animate-pulse">Loading products...</div>
                ) : products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onEdit={() => {
                                setEditingProduct(product);
                                setShowModal(true);
                            }}
                            onDelete={() => handleDeleteProduct(product._id)}
                        />
                    ))
                ) : (
                    <div className="text-center text-gray-500 p-4">No products found.</div>
                )}
            </section>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
                <button
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border rounded"
                >
                    Previous
                </button>
                <span>Page {page}</span>
                <button
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={products.length < limit}
                    className="px-4 py-2 border rounded"
                >
                    Next
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <ProductForm
                            initialData={editingProduct}
                            onSubmit={handleSubmit}
                        />
                        <button
                            onClick={() => {
                                setShowModal(false);
                                setEditingProduct(null);
                            }}
                            className="mt-4 text-sm text-gray-600 hover:underline"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
