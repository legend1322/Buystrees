import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/admin/Category";

export async function GET() {
  try {
    await connectDB();

    // Fetch categories with both name and custom product fields
    const categories = await Category.find().select("name productFields");

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories." },
      { status: 500 }
    );
  }
}
