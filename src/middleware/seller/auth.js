import { connectDB } from "@/lib/db";
import Seller from "@/models/seller/Seller";
import jwt from "jsonwebtoken";

export async function authMiddleware(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    const cookieHeader = req.headers.get("cookie");

    let token = authHeader?.split("token")[1];
    if (!token && cookieHeader) {
      const cookieMatch = cookieHeader.match(/token=([^;]+)/);
      token = cookieMatch ? cookieMatch[1] : null;
    }

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in environment variables.");
      return Response.json({ error: "Internal server error" }, { status: 500 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const seller = await Seller.findById(decoded.id).select("-password");

    if (!seller) {
      return Response.json({ error: "Seller not found" }, { status: 404 });
    }

    req.seller = seller; // Attach seller to request
    return true; // Indicate successful authentication

  } catch (error) {
    console.error("Authentication error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
