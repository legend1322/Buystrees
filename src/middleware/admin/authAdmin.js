import jwt from "jsonwebtoken";
import Admin from "@/models/admin/Admin";
import { connectDB } from "@/lib/db";

// Middleware function to authenticate admin using HTTP-only cookie
export async function authenticateAdmin(req) {
  try {
    await connectDB();

    // Extract token from the "cookie" header
    const cookieHeader = req.headers.get("cookie");

    if (!cookieHeader) return null;

    // Extract the 'token' from cookie string (e.g., token=abc.def.ghi;)
    const tokenMatch = cookieHeader.match(/token=([^;]+)/);
    if (!tokenMatch) return null;

    const token = tokenMatch[1];

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch admin from database
    const admin = await Admin.findById(decoded.id);

    return admin || null;
  } catch (err) {
    console.error("Authentication error:", err);
    return null;
  }
}
