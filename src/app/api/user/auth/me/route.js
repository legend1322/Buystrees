
// api/user/auth/me/route.js

import { NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/user/auth";

// GET current authenticated user
export async function GET(req) {
  const auth = await authMiddleware(req);
  if (auth instanceof NextResponse) return auth;

  return NextResponse.json({ user: req.user }, { status: 200 });
}

// PUT - update user info
export async function PUT(req) {
  const auth = await authMiddleware(req);
  if (auth instanceof NextResponse) return auth;

  const { name, email, profilePicture } = await req.json();

  if (name) req.user.name = name;
  if (email) req.user.email = email;
  if (profilePicture) req.user.profilePicture = profilePicture;

  await req.user.save();

  return NextResponse.json(
    {
      message: "Profile updated",
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        profilePicture: req.user.profilePicture
      }
    },
    { status: 200 }
  );
}

