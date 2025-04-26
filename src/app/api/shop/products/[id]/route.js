// app/api/shop/products/[id]/route.js
import { connectDB } from "@/lib/db";
import Product from "@/models/seller/Product";

export async function GET(req, context) {
  try {
    await connectDB();

    const { id: productId } = await context.params; // ⬅️ Awaiting `params`

    if (!productId) {
      return new Response(
        JSON.stringify({ error: "Product ID is required" }),
        { status: 400 }
      );
    }

    const product = await Product.findById(productId).lean();

    if (!product) {
      return new Response(
        JSON.stringify({ error: "Product not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (err) {
    console.error("GET /api/shop/products/:id error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch product" }),
      { status: 500 }
    );
  }
}
