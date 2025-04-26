import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/shop/order";

export async function GET() {
  await connectDB();

  try {
    const orders = await Order.find()
    .populate("userId", "name email")
    .populate({
      path: "orderItems.productId",
      select: "name price image seller", // use 'seller' not 'sellerId'
      populate: {
        path: "seller",
        select: "name email",
      },
    })
    .sort({ createdAt: -1 });
  

    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (err) {
    console.error("❌ Fetch Orders Error:", err.message);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
