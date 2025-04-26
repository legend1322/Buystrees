"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function NewProduct() {
    const [form, setForm] = useState({ name: "", description: "", price: "", stock: "", category: "" });
    const [images, setImages] = useState([]);
    const router = useRouter();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImages(Array.from(e.target.files)); // Convert FileList to Array
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => formData.append(key, value)); // Append text fields

        images.forEach((image) => formData.append("images", image)); // Append images

        await axios.post("/api/seller/products", formData, {
            headers: { 
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        router.push("/Seller/dashboard/products");
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Add Product</h1>
            <form onSubmit={handleSubmit} className="mt-4">
                <input type="text" name="name" placeholder="Product Name" className="block w-full p-2 mb-2 border rounded" onChange={handleChange} required />
                <textarea name="description" placeholder="Description" className="block w-full p-2 mb-2 border rounded" onChange={handleChange} required></textarea>
                <input type="number" name="price" placeholder="Price" className="block w-full p-2 mb-2 border rounded" onChange={handleChange} required />
                <input type="number" name="stock" placeholder="Stock" className="block w-full p-2 mb-2 border rounded" onChange={handleChange} required />
                <input type="text" name="category" placeholder="Category" className="block w-full p-2 mb-2 border rounded" onChange={handleChange} required />

                {/* Image Upload Input */}
                <input type="file" multiple onChange={handleImageChange} className="block w-full p-2 mb-2 border rounded" accept="image/*" />

                {/* Preview Selected Images */}
                {images.length > 0 && (
                    <div className="flex gap-2 mt-2">
                        {images.map((img, idx) => (
                            <img key={idx} src={URL.createObjectURL(img)} alt="Preview" className="w-16 h-16 object-cover rounded" />
                        ))}
                    </div>
                )}

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2">Add Product</button>
            </form>
        </div>
    );
}




// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// export default function NewProduct() {
//     const [form, setForm] = useState({ name: "", description: "", price: "", stock: "", category: "" });
//     const router = useRouter();

//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         await axios.post("/api/seller/products", form, {
//             headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//         });
//         router.push("/Seller/dashboard/products");
//     };

//     return (
//         <div className="p-6">
//             <h1 className="text-2xl font-bold">Add Product</h1>
//             <form onSubmit={handleSubmit} className="mt-4">
//                 <input type="text" name="name" placeholder="Product Name" className="block w-full p-2 mb-2 border rounded" onChange={handleChange} required />
//                 <textarea name="description" placeholder="Description" className="block w-full p-2 mb-2 border rounded" onChange={handleChange} required></textarea>
//                 <input type="number" name="price" placeholder="Price" className="block w-full p-2 mb-2 border rounded" onChange={handleChange} required />
//                 <input type="number" name="stock" placeholder="Stock" className="block w-full p-2 mb-2 border rounded" onChange={handleChange} required />
//                 <input type="text" name="category" placeholder="Category" className="block w-full p-2 mb-2 border rounded" onChange={handleChange} required />
                
//                 <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Product</button>
//             </form>
//         </div>
//     );
// }
