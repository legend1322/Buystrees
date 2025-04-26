import { connectDB } from "@/lib/db";
import Seller from "@/models/seller/Seller";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Helper function for validating request body
const validateInput = ({ name, email, password }) => {
  if (!name || !email || !password) {
    return "All fields are required.";
  }

  // Password strength validation: at least 8 characters, including a number and a special character
  const passwordStrengthRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
  if (!passwordStrengthRegex.test(password)) {
    return "Password must be at least 8 characters long, include a number and a special character.";
  }

  // Email regex validation for basic email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format.";
  }

  return null;
};

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    // Validate input
    const validationError = validateInput({ name, email, password });
    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 });
    }

    // Check if email is already registered
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return Response.json({ error: "Email already in use" }, { status: 400 });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new seller
    const newSeller = await Seller.create({ name, email, password: hashedPassword });

    // Validate JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in environment variables.");
      return Response.json({ error: "Internal server error" }, { status: 500 });
    }

    // Generate JWT token for auto-login
    const token = jwt.sign({ id: newSeller._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Create a secure HTTP-only cookie
    const response = Response.json({
      message: "Seller registered successfully",
      seller: { id: newSeller._id, name: newSeller.name, email: newSeller.email }
    });

    response.headers.set("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; Secure; SameSite=Strict`);

    return response;
  } catch (error) {
    console.error("Error during registration:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

