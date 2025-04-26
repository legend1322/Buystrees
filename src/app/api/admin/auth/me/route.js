import { connectDB } from "@/lib/db";
import Admin from "@/models/admin/Admin";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    // 🍪 Get the cookie from the request headers
    const cookie = req.headers.get("cookie");

    // ⛔ If no cookie is found
    if (!cookie) {
      return NextResponse.json({ success: false, message: "Unauthorized: No token" }, { status: 401 });
    }

    // 🍪 Extract token from cookie string (e.g., token=abc.def.ghi;)
    const tokenMatch = cookie.match(/token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized: Invalid token" }, { status: 401 });
    }

    // 🔐 Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🧠 Get admin details from DB
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return NextResponse.json({ success: false, message: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: admin });

  } catch (error) {
    console.error("GET /api/admin/auth/me error:", error);

    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }

    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
