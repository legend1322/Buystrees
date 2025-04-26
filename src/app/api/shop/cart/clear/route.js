import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/shop/cart";

export async function DELETE(req) {
  await connectDB();

  try {
    const { userId, anonymousCartId } = await req.json();

    if (!userId && !anonymousCartId) {
      return NextResponse.json({ error: "Missing userId or anonymousCartId" }, { status: 400 });
    }

    const filter = userId ? { userId } : { anonymousCartId };

    const cart = await Cart.findOne(filter);
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    await cart.deleteOne(); // 🗑️ Delete the whole cart document

    return NextResponse.json({ message: "Cart cleared successfully" }, { status: 200 });

  } catch (err) {
    console.error("❌ Clear cart error:", err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
