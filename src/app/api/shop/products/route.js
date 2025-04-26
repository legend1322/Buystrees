import { connectDB } from "@/lib/db";
import Product from "@/models/seller/Product";

export async function GET(req) {
  try {
    await connectDB();

    // Create a URL object to parse the query string
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || ""; // Get category from query params
    const sort = searchParams.get("sort") || "newest"; // newest, price_asc, price_desc
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;

    // Ensure page and limit are valid numbers
    if (page < 1 || limit < 1) {
      return new Response(
        JSON.stringify({ error: "Invalid pagination parameters" }),
        { status: 400 }
      );
    }

    // Build MongoDB query
    const query = {
      name: { $regex: search, $options: "i" },
      status: "active",
    };

    // If a category is provided, filter by category
    if (category) {
      query.category = category;
    }

    // Sort options
    const sortOptions = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
    };

    // Get the total count of products matching the query
    const total = await Product.countDocuments(query);

    // Fetch the products with pagination and sorting
    const products = await Product.find(query)
      .sort(sortOptions[sort] || { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return new Response(
      JSON.stringify({ products, total }),
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/products error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch products" }),
      { status: 500 }
    );
  }
}
