import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import Product from "@/models/seller/Product";

// DELETE /api/admin/products/[id]
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const deleted = await Product.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Product deleted." });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
