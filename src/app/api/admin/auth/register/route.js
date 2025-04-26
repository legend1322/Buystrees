import { connectDB } from "@/lib/db";
import Admin from "@/models/admin/Admin";
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
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA8]{2,}$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format.";
  }

  return null;
};

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, password, role } = await req.json();

    // Validate input
    const validationError = validateInput({ name, email, password });
    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 });
    }

    // Only allow `role` as superadmin
    if (role !== "superadmin") {
      return Response.json({ error: "Only superadmin can register other superadmins." }, { status: 400 });
    }

    // Check if email is already registered
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return Response.json({ error: "Email already in use" }, { status: 400 });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new superadmin
    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: "superadmin" // Default to superadmin
    });

    // Validate JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in environment variables.");
      return Response.json({ error: "Internal server error" }, { status: 500 });
    }

    // Generate JWT token for auto-login
    const token = jwt.sign({ id: newAdmin._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Create a secure HTTP-only cookie
    const response = Response.json({
      message: "Superadmin registered successfully",
      admin: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email }
    });

    response.headers.set("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; Secure; SameSite=Strict`);

    return response;
  } catch (error) {
    console.error("Error during superadmin registration:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
