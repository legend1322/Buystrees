import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Seller from "@/models/seller/Seller";
import Product from "@/models/seller/Product"; // Correct this import path if necessary
import fs from "fs";
import path from "path";

// Utility function to delete files
const deleteFile = (filePath) => {
  const fullPath = path.join(process.cwd(), "public", filePath); // Modify if file paths are different
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    } else {
      console.log(`File ${filePath} deleted successfully.`);
    }
  });
};

// GET /api/admin/sellers/:id — View Seller Profile
export async function GET(req, { params }) {
  await connectDB();
  const { id } = await params;

  try {
    const seller = await Seller.findById(id).select("-password");

    if (!seller) {
      return NextResponse.json({ success: false, message: "Seller not found" }, { status: 404 });
    }

    const lastActiveAt = seller.updatedAt;

    return NextResponse.json({
      success: true,
      seller,
      lastActiveAt,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error", error }, { status: 500 });
  }
}

// PUT /api/admin/sellers/:id — Update Seller (verify, approve, ban, etc.)
export async function PUT(req, { params }) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();

  try {
    const allowedUpdates = ["name", "email", "status", "profileImage"];
    const updates = {};

    for (const key of allowedUpdates) {
      if (body[key]) updates[key] = body[key];
    }

    const updatedSeller = await Seller.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedSeller) {
      return NextResponse.json({ success: false, message: "Seller not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Seller updated successfully",
      seller: updatedSeller,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error", error }, { status: 500 });
  }
}

// DELETE /api/admin/sellers/:id — Delete Seller and Their Products
export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = await params;

  try {
    const deletedSeller = await Seller.findByIdAndDelete(id);

    if (!deletedSeller) {
      return NextResponse.json({ success: false, message: "Seller not found" }, { status: 404 });
    }

    // Delete all products created by the seller
    const products = await Product.find({ seller: id });

    // Delete product images
    products.forEach((product) => {
      if (product.images) {
        product.images.forEach((imagePath) => {
          deleteFile(imagePath); // Delete each image associated with the product
        });
      }
    });

    // Delete products from the database
    await Product.deleteMany({ seller: id });

    return NextResponse.json({
      success: true,
      message: "Seller and their products deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error", error }, { status: 500 });
  }
}
