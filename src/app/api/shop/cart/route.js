import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/shop/cart";
import Product from "@/models/seller/Product";

export async function GET(req) {
  await connectDB();

  const userId = req.nextUrl.searchParams.get("userId");
  const anonymousCartId = req.nextUrl.searchParams.get("anonymousCartId");

  if (!userId && !anonymousCartId) {
    return NextResponse.json({ error: "No user or anonymous ID provided" }, { status: 400 });
  }

  const filter = userId ? { userId } : { anonymousCartId };
  const cart = await Cart.findOne(filter).populate("items.productId");

  if (!cart) {
    return NextResponse.json({ cart: null }, { status: 200 });
  }

  return NextResponse.json({ cart }, { status: 200 },);
}
