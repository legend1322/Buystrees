import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user/User";
import jwt from "jsonwebtoken";

export async function authMiddleware(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    const cookieHeader = req.headers.get("cookie");

    let token = authHeader?.split("token")[1]?.trim();
    if (!token && cookieHeader) {
      const cookieMatch = cookieHeader.match(/token=([^;]+)/);
      token = cookieMatch ? cookieMatch[1] : null;
    }

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in environment variables.");
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Set user to req for further use in API handlers
    req.user = user;

    return true;

  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
