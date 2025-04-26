import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/seller/Product";
import { authMiddleware } from "@/middleware/seller/auth";
import { saveImage } from "@/utils/seller/imageUpload";

// ➤ Add a New Product
export async function POST(req) {
    try {
        await connectDB();
        const auth = await authMiddleware(req);
        if (auth instanceof NextResponse) return auth;

        const formData = await req.formData();
        const name = formData.get("name");
        const description = formData.get("description");
        const price = parseFloat(formData.get("price"));
        const stock = parseInt(formData.get("stock"));
        const category = formData.get("category");
        const status = formData.get("status") || "active";

        // Handle Image Upload
        const images = [];
        const files = formData.getAll("images");
        for (const file of files) {
            const imagePath = await saveImage(file, req.seller._id);
            images.push(imagePath);
        }

        const product = new Product({
            seller: req.seller._id,
            name,
            description,
            price,
            stock,
            category,
            images, // Store image paths
            status
        });

        await product.save();
        return NextResponse.json({ message: "Product added", product }, { status: 201 });

    } catch (error) {
        console.error("Error in POST /api/seller/products:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}


// ➤ Get All Products by Seller (with Search, Category, Sort, Pagination)
export async function GET(req) {
    try {
        await connectDB();
        const auth = await authMiddleware(req);
        if (auth instanceof NextResponse) return auth;

        const { searchParams } = new URL(req.url);

        const searchQuery = searchParams.get("search") || "";
        const searchRegex = new RegExp(searchQuery, "i");

        let sortField = searchParams.get("sort") || "createdAt";
        let sortOrder = searchParams.get("order") === "asc" ? 1 : -1;

        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const skip = (page - 1) * limit;

        // Validate sortField
        const allowedFields = ["name", "price", "stock", "category", "createdAt"];
        if (!allowedFields.includes(sortField)) {
            sortField = "createdAt";
        }

        const products = await Product.find({
            seller: req.seller._id,
            $or: [
                { name: { $regex: searchRegex } },
                { category: { $regex: searchRegex } }
            ]
        })
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(limit)
            .select("-__v -updatedAt");

        return NextResponse.json(products, { status: 200 });

    } catch (error) {
        console.error("Error in GET /api/seller/products:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
