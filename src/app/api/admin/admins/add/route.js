import { connectDB } from "@/lib/db";
import Admin from "@/models/admin/Admin";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    // 🔒 Check for missing fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Please fill in all fields" },
        { status: 400 }
      );
    }

    // 🔎 Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, error: "Admin with this email already exists" },
        { status: 400 }
      );
    }

    // 🔐 Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ➕ Create new admin
    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({
      success: true,
      message: "Admin created successfully",
      admin: {
        _id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
      },
    });
  } catch (err) {
    console.error("Add Admin Error:", err);
    return NextResponse.json(
      { success: false, error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
