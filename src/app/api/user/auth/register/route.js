import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "@/models/user/User";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not defined");
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // ✅ Call cookies() before branching logic
    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: "strict",
      secure: true,
    });

    return NextResponse.json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
