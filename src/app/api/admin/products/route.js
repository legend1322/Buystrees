// View all products along with their sellers.

import { NextResponse } from "next/server";
import {connectDB} from "@/lib//db";
import Product from "@/models/seller/Product";
import Seller from "@/models/seller/Seller";

// GET /api/admin/products
export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({})
      .populate("seller", "name email") // Only select name and email from Seller
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products for admin:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products." },
      { status: 500 }
    );
  }
}
