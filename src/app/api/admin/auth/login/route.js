import { connectDB } from "@/lib/db";
import Admin from "@/models/admin/Admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    // Validate input fields
    if (!email || !password) {
      return Response.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Find the user (Admin in this case) by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Compare the entered password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Check if the JWT_SECRET is set in environment variables
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in the environment variables.");
      return Response.json({ error: "Internal server error" }, { status: 500 });
    }

    // Generate JWT token
    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Create the response JSON and set the token as an HTTP-only cookie
    const response = Response.json({
      message: "Login successful",
      admin: { id: admin._id, name: admin.name, email: admin.email }
    });

    // Set the JWT token in an HTTP-only cookie for security
    response.headers.set("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; Secure; SameSite=Strict`);

    return response;

  } catch (error) {
    console.error("Error logging in:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
