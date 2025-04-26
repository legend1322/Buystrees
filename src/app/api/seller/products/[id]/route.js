import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/seller/Product";
import { authMiddleware } from "@/middleware/seller/auth";
import mongoose from "mongoose";
import { saveImage } from "@/utils/seller/imageUpload";
import path from "path";
import fs from "fs/promises";

// ✅ Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ➤ Get Single Product (Secure)
export async function GET(req, { params }) {
    try {
        await connectDB();

        const { id } = await params;
        if (!isValidObjectId(id)) {
            return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
        }

        const product = await Product.findById(id).select("-__v -createdAt -updatedAt");
        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product, { status: 200 });

    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// ➤ Update Product (Secure)
export async function PUT(req, { params }) {
    try {
        await connectDB();
        const auth = await authMiddleware(req);
        if (auth instanceof NextResponse) return auth;

        const { id } = await params;
        if (!isValidObjectId(id)) {
            return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
        }

        const product = await Product.findOne({ _id: id, seller: req.seller._id });
        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        const formData = await req.formData();
        const updates = {
            name: formData.get("name") || product.name,
            description: formData.get("description") || product.description,
            price: parseFloat(formData.get("price")) || product.price,
            stock: parseInt(formData.get("stock")) || product.stock,
            category: formData.get("category") || product.category,
            status: formData.get("status") || product.status,
        };

        // ✅ Handle New Image Uploads
        const newImages = [];
        const files = formData.getAll("images");

        for (const file of files) {
            if (file.size > 0) {
                const imagePath = await saveImage(file, req.seller._id);
                newImages.push(imagePath);
            }
        }

        if (newImages.length > 0) {
            updates.images = newImages;
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });

        return NextResponse.json({ message: "Product updated", product: updatedProduct }, { status: 200 });

    } catch (error) {
        console.error("Error in PUT /api/seller/products/[id]:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// ➤ Delete Product (Secure)
export async function DELETE(req, { params }) {
    try {
        await connectDB();

        const auth = await authMiddleware(req);
        if (auth instanceof NextResponse) return auth;

        const { id } = await params;
        if (!isValidObjectId(id)) {
            return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
        }

        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        if (!product.seller.equals(req.seller._id)) {
            return NextResponse.json({ message: "Unauthorized: You can only delete your own products" }, { status: 403 });
        }

        // 🔹 Delete all images
        for (const imagePath of product.images) {
            const absolutePath = path.join(process.cwd(), "public", imagePath);
            try {
                await fs.unlink(absolutePath);
            } catch (err) {
                console.warn("⚠️ Failed to delete image:", absolutePath, err.message);
            }
        }

        await product.deleteOne();

        return NextResponse.json({ message: "Product and images deleted" }, { status: 200 });

    } catch (error) {
        console.error("DELETE Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
