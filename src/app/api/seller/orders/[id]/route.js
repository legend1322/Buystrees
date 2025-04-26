import { connectDB } from "@/lib/db";
import Order from "@/models/shop/order";
import Product from "@/models/seller/Product";
import { authMiddleware } from "@/middleware/seller/auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function PUT(req, { params }) {
  const authResult = await authMiddleware(req);
  if (authResult !== true) return authResult;

  try {
    await connectDB();
    const sellerId = req.seller._id;
    const {id: orderId} = await params;

    const { status } = await req.json();
    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if at least one product in the order belongs to the current seller
    const productIds = order.orderItems.map(item => item.productId);
    const sellerOwnedProduct = await Product.findOne({
      _id: { $in: productIds },
      seller: sellerId
    });

    if (!sellerOwnedProduct) {
      return NextResponse.json({ error: "Unauthorized to update this order" }, { status: 403 });
    }

    // Update the order status
    order.status = status;
    await order.save();

    return NextResponse.json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
