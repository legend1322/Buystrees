import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/shop/cart";
import Order from "@/models/shop/order";

export async function POST(req) {
  await connectDB();

  try {
    const {
      userId,
      shippingAddress,
      paymentMethod = "COD", // Default to COD
    } = await req.json();

    if (!userId || !shippingAddress) {
      return NextResponse.json(
        { error: "User ID and shipping address are required" },
        { status: 400 }
      );
    }

    // Get user cart
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty, cannot proceed with checkout" },
        { status: 400 }
      );
    }

    // Calculate prices
    const itemsPrice = cart.totalPrice;
    const shippingPrice = 20; // You can calculate based on cart weight, distance, etc.
    const taxPrice = itemsPrice * 0.1; // Example: 10% tax
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    // Create order
    const order = new Order({
      userId,
      orderItems: cart.items.map(item => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image || "",
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    await order.save();

    // Clear cart after successful order placement
    await Cart.findOneAndUpdate({ userId }, { items: [], totalQuantity: 0, totalPrice: 0 });

    return NextResponse.json(
      { message: "Order placed successfully", order },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Checkout Error:", err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
