import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/shop/cart";

export async function POST(req) {
  await connectDB();

  try {
    const { anonymousCartId, userId } = await req.json();

    if (!anonymousCartId || !userId) {
      return NextResponse.json({ error: "anonymousCartId and userId are required" }, { status: 400 });
    }

    const anonCart = await Cart.findOne({ anonymousCartId });

    if (!anonCart) {
      return NextResponse.json({ message: "No anonymous cart found" }, { status: 200 });
    }

    // Assign the userId to the anonymous cart
    anonCart.userId = userId;
    // anonCart.anonymousCartId = undefined; // Optional: remove anonymous ID

    await anonCart.save();

    return NextResponse.json({ message: "Anonymous cart assigned to user", cart: anonCart }, { status: 200 });
  } catch (err) {
    console.error("❌ Assign Cart Error:", err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
