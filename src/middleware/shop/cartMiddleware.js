// middleware/cartMiddleware.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function CartMiddleware(req) {
  try {
    // 1. Check if the user is logged in (using JWT from cookies)
    const cookie = cookies();
    const token = cookie.get("token");

    if (token && typeof token === "string") {
      // User is logged in, decode the JWT to get user information
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded && decoded.id) {
        return NextResponse.json({
          userId: decoded.id, // Pass the userId to the next handler or API
        });
      }
    }

    // 2. If not logged in, return an error (since localStorage is not available in server-side code)
    return NextResponse.json(
      { error: "No user logged in and no anonymousCartId found." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in cart middleware:", error);
    return NextResponse.json(
      { error: "Internal server error while checking cart." },
      { status: 500 }
    );
  }
}
