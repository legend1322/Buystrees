import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/admin/Category";

// GET /api/admin/categories/:id — Get a category by ID
export async function GET(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, category });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/categories/:id — Delete a category
export async function DELETE(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/admin/categories/:id — Update product details
export async function PUT(req, context) {
    try {
      await connectDB();
  
      const { id } = await context.params; // ✅ fixed
      const { productDetails } = await req.json();
  
      if (!Array.isArray(productDetails)) {
        return NextResponse.json({ success: false, error: "Invalid product details" }, { status: 400 });
      }
  
      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        { productFields: productDetails },
        { new: true }
      );
  
      if (!updatedCategory) {
        return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
      }
  
      return NextResponse.json({ success: true, category: updatedCategory });
    } catch (error) {
      console.error("PUT /api/admin/categories/:id error:", error); // Add this for debugging
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }
  