import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // Adjust path if needed
import Category from "@/models/admin/Category";

// GET all categories
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ createdAt: -1 });
    // console.log("Fetched Categories:", categories); // Debugging log
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// CREATE a new category
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { name } = body; // Removed productFields

    if (!name) {
      return NextResponse.json({ success: false, error: "Category name is required" }, { status: 400 });
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      return NextResponse.json({ success: false, error: "Category already exists" }, { status: 400 });
    }

    const newCategory = await Category.create({
      name,
    });

    // console.log("New Category Created:", newCategory);
    return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE a category by ID
export async function DELETE(req) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const categoryId = url.pathname.split("/").pop();

    if (!categoryId) {
      return NextResponse.json({ success: false, error: "Category ID is required" }, { status: 400 });
    }

    const deleted = await Category.findByIdAndDelete(categoryId);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    console.log("Deleted Category:", deleted);
    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
