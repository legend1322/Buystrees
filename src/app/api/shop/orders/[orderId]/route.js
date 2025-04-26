// /app/api/shop/orders/[orderId]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/shop/order";

export async function GET(req, context) {
  await connectDB();
  try {
    // Await the params before destructuring
    const params = await context.params;
    const orderId = params.orderId;
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    
    if (!orderId || !userId) {
      return NextResponse.json(
        { error: "Order ID and User ID are required" },
        { status: 400 }
      );
    }
    
    // Find the order for the specific user
    // This ensures users can only access their own orders
    const order = await Order.findOne({
      _id: orderId,
      userId: userId
    });
    
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ order }, { status: 200 });
  } catch (err) {
    console.error("❌ Fetch Single Order Error:", err.message);
    return NextResponse.json(
      { error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}

// Update order status (admin only)
export async function PATCH(req, context) {
  await connectDB();
  try {
    // Await the params before destructuring
    const params = await context.params;
    const orderId = params.orderId;
    const { isPaid, isDelivered, adminId } = await req.json();
    
    // In a real application, you'd validate if the user is an admin
    // This is a simplified version
    
    const updateData = {};
    
    if (isPaid !== undefined) {
      updateData.isPaid = isPaid;
      if (isPaid) updateData.paidAt = new Date();
    }
    
    if (isDelivered !== undefined) {
      updateData.isDelivered = isDelivered;
      if (isDelivered) updateData.deliveredAt = new Date();
    }
    
    const order = await Order.findByIdAndUpdate(
      orderId,
      { $set: updateData },
      { new: true }
    );
    
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: "Order updated successfully",
      order 
    }, { status: 200 });
  } catch (err) {
    console.error("❌ Update Order Error:", err.message);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}