// /app/api/shop/orders/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/shop/order";
import mongoose from "mongoose";

export async function GET(req) {
  await connectDB();
  try {
    // Get query params
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    
    // Validate userId
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    
    // Fetch orders for the user, sort by createdAt in descending order (newest first)
    // Don't try to populate productId since it might cause issues
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 });
      
    return NextResponse.json({ orders }, { status: 200 });
  } catch (err) {
    console.error("❌ Fetch Orders Error:", err.message);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
