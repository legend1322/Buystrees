import { connectDB } from "@/lib/db";
import Product from "@/models/seller/Product";

export async function getProduct(id) {
  try {
    await connectDB();
    const product = await Product.findById(id).lean();
    // Convert MongoDB document to plain object
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}