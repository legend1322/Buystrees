import { connectDB } from "@/lib/db";
import Order from "@/models/shop/order";
import Product from "@/models/seller/Product";
import { authMiddleware } from "@/middleware/seller/auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req) {
  const authResult = await authMiddleware(req);
  if (authResult !== true) return authResult;

  try {
    await connectDB();
    const sellerId = req.seller._id;

    // Find all products by this seller
    const sellerProducts = await Product.find({ seller: sellerId }, "_id");

    const sellerProductIds = sellerProducts.map(p => p._id.toString());

    // Find orders where any item has productId matching seller's product
    const orders = await Order.find({
      "orderItems.productId": { $in: sellerProductIds }
    })
      .populate("userId", "name email");

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    return NextResponse.json({ error: "Failed to fetch seller orders" }, { status: 500 });
  }
}
