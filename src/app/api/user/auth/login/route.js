// user login

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import User from "@/models/user/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in the environment variables.");
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Set cookie using cookies() instead of raw headers
    const cookie = await cookies();
      cookie.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    return NextResponse.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}



