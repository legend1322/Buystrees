"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SellerProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("createdAt");
    const [order, setOrder] = useState("desc");
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedProducts, setSelectedProducts] = useState(new Set());
    const [editMode, setEditMode] = useState({});
    
    // State for Add Product Form
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        status: "active",
        images: []
    });

    const [imagePreview, setImagePreview] = useState([]);

    // Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const query = new URLSearchParams({ search, sort, order, page, limit }).toString();
                
                const res = await fetch(`/api/seller/products?${query}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    cache: "no-store",
                });

                if (!res.ok) throw new Error("Failed to fetch products");

                const data = await res.json();
                setProducts(data || []);
                setTotalPages(Math.ceil(data.length / limit));
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [search, sort, order, page]);

    // Handle Input Change for Add Product Form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle Image Selection
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData((prev) => ({ ...prev, images: files }));

        // Preview Images
        const previews = files.map((file) => URL.createObjectURL(file));
        setImagePreview(previews);
    };

    // Handle Add Product Submission
    const handleAddProduct = async (e) => {
        e.preventDefault();

        const productData = new FormData();
        productData.append("name", formData.name);
        productData.append("description", formData.description);
        productData.append("price", formData.price);
        productData.append("stock", formData.stock);
        productData.append("category", formData.category);
        productData.append("status", formData.status);
        formData.images.forEach((image) => productData.append("images", image));

        try {
            const res = await fetch("/api/seller/products", {
                method: "POST",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                body: productData
            });

            if (!res.ok) throw new Error("Failed to add product");

            const newProduct = await res.json();
            setProducts((prev) => [newProduct.product, ...prev]); // Add new product to UI
            setFormData({
                name: "",
                description: "",
                price: "",
                stock: "",
                category: "",
                status: "active",
                images: []
            });
            setImagePreview([]);
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Your Products</h1>

            {/* ➤ ADD PRODUCT SECTION */}
            <form onSubmit={handleAddProduct} className="mt-6 p-4 border rounded bg-gray-100">
                <h2 className="text-lg font-semibold mb-2">Add New Product</h2>

                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required className="border p-2 rounded" />
                    <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required className="border p-2 rounded" />
                    <input type="number" name="stock" placeholder="Stock Quantity" value={formData.stock} onChange={handleChange} required className="border p-2 rounded" />
                    <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required className="border p-2 rounded" />
                </div>

                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required className="border p-2 rounded w-full mt-3"></textarea>

                <label className="block mt-3">
                    <span className="font-semibold">Product Images:</span>
                    <input type="file" multiple accept="image/*" onChange={handleImageChange} required className="border p-2 rounded mt-1" />
                </label>

                {/* Image Preview */}
                <div className="flex gap-2 mt-2">
                    {imagePreview.map((src, index) => (
                        <Image key={index} src={src} alt="Preview" width={50} height={50} className="border rounded" />
                    ))}
                </div>

                <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Add Product</button>
            </form>

            {/* ➤ EXISTING PRODUCT LIST */}
            <div className="overflow-x-auto mt-6">
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Image</th>
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Price</th>
                            <th className="border p-2">Stock</th>
                            <th className="border p-2">Category</th>
                            <th className="border p-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id} className="border">
                                <td className="border p-2">
                                    <Image src={`/uploads/${product.images[0]}`} alt={product.name} width={50} height={50} />
                                </td>
                                <td className="border p-2">{product.name}</td>
                                <td className="border p-2">₹{product.price}</td>
                                <td className="border p-2">{product.stock}</td>
                                <td className="border p-2">{product.category}</td>
                                <td className="border p-2">{product.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
