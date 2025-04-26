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
      paymentMethod = "COD", // Default payment method
    } = await req.json();
    
    // Validate required fields
    if (
      !userId ||
      !shippingAddress?.fullName ||
      !shippingAddress?.address ||
      !shippingAddress?.city ||
      !shippingAddress?.state ||
      !shippingAddress?.postalCode ||
      !shippingAddress?.country ||
      !shippingAddress?.phoneNumber
    ) {
      return NextResponse.json(
        { error: "All shipping address fields and user ID are required." },
        { status: 400 }
      );
    }
    
    // Fetch user's cart with populated product information
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty, cannot proceed with checkout." },
        { status: 400 }
      );
    }
    
    // Price calculations
    const itemsPrice = cart.totalPrice;
    const shippingPrice = 20; // Flat rate for now
    const taxPrice = parseFloat((itemsPrice * 0.1).toFixed(2)); // 10% tax
    const totalPrice = parseFloat((itemsPrice + shippingPrice + taxPrice).toFixed(2));
    
    // Create order with properly mapped items
    const order = new Order({
      userId,
      orderItems: cart.items.map((item) => ({
        productId: item.productId._id, // Use the product ID
        name: item.productId.name, // Get name from productId object
        quantity: item.quantity,
        price: item.productId.price, // Get price from productId object
        image: item.productId.image || "",
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });
    
    await order.save();
    
    // Empty cart
    await Cart.findOneAndUpdate(
      { userId },
      { items: [], totalQuantity: 0, totalPrice: 0 }
    );
    
    return NextResponse.json(
      { message: "Order placed successfully", order },
      { status: 200 }
    );
    
  } catch (err) {
    console.error("❌ Checkout Error:", err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}