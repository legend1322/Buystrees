import { connectDB } from "@/lib/db";
import Seller from "@/models/seller/Seller";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();
    
    const { email, password } = await req.json();
    if (!email || !password) {
      return Response.json({ error: "Email and password are required" }, { status: 400 });
    }

    const seller = await Seller.findOne({ email });
    if (!seller) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in the environment variables.");
      return Response.json({ error: "Internal server error" }, { status: 500 });
    }

    const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Set the token as an HTTP-only cookie for better security
    const response = Response.json({
      message: "Login successful",
      seller: { id: seller._id, name: seller.name, email: seller.email }
    });

    response.headers.set("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; Secure; SameSite=Strict`);
    
    return response;

  } catch (error) {
    console.error("Error logging in:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}


