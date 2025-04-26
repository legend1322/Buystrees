import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/shop/cart";

export async function DELETE(req) {
  await connectDB();

  try {
    const { userId, anonymousCartId, productId } = await req.json();

    if (!productId || (!userId && !anonymousCartId)) {
      return NextResponse.json({ error: "Missing productId or identity" }, { status: 400 });
    }

    const filter = userId ? { userId } : { anonymousCartId };
    const cart = await Cart.findOne(filter).populate("items.productId");
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => !item.productId.equals(productId));

    if (cart.items.length === initialLength) {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
    }

// Recalculate totals
cart.totalPrice = cart.items.reduce((sum, item) => {
  const quantity = Number(item.quantity) || 0;
  const price = Number(item.productId?.price) || 0;
  return sum + quantity * price;
}, 0);


    
    await cart.save();

    return NextResponse.json(cart, { status: 200 });

  } catch (err) {
    console.error("❌ Remove from cart error:", err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
