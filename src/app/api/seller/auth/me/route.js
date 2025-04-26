import { authMiddleware } from "@/middleware/seller/auth";

export async function GET(req) {
  const auth = await authMiddleware(req);
  if (auth instanceof Response) return auth; // If authentication fails, return the response

  return Response.json({ seller: req.seller }, { status: 200 });
}

export async function PUT(req) {
  const auth = await authMiddleware(req);
  if (auth instanceof Response) return auth;

  const { name, email, profilePicture } = await req.json();

  if (name) req.seller.name = name;
  if (email) req.seller.email = email;
  if (profilePicture) req.seller.profilePicture = profilePicture;

  await req.seller.save();

  return Response.json({ message: "Profile updated", seller: req.seller }, { status: 200 });
}






// import { connectDB } from "@/lib/db";
// import Seller from "@/models/Seller";
// import jwt from "jsonwebtoken";

// export async function GET(req) {
//   try {
//     await connectDB();

//     const authHeader = req.headers.get("authorization");
//     const cookieHeader = req.headers.get("cookie");

//     let token = authHeader?.split("token")[1];
//     if (!token && cookieHeader) {
//       const cookieMatch = cookieHeader.match(/token=([^;]+)/);
//       token = cookieMatch ? cookieMatch[1] : null;
//     }

//     if (!token) {
//       return Response.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     if (!process.env.JWT_SECRET) {
//       console.error("JWT_SECRET is missing in environment variables.");
//       return Response.json({ error: "Internal server error" }, { status: 500 });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const seller = await Seller.findById(decoded.id).select("-password");

//     if (!seller) {
//       return Response.json({ error: "Seller not found" }, { status: 404 });
//     }

//     return Response.json({ seller }, { status: 200 });

//   } catch (error) {
//     console.error("Error fetching seller profile:", error);
//     return Response.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

// export async function PUT(req) {
//   try {
//     await connectDB();

//     const authHeader = req.headers.get("authorization");
//     const cookieHeader = req.headers.get("cookie");

//     let token = authHeader?.split("token")[1];
//     if (!token && cookieHeader) {
//       const cookieMatch = cookieHeader.match(/token=([^;]+)/);
//       token = cookieMatch ? cookieMatch[1] : null;
//     }

//     if (!token) {
//       return Response.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     if (!process.env.JWT_SECRET) {
//       console.error("JWT_SECRET is missing in environment variables.");
//       return Response.json({ error: "Internal server error" }, { status: 500 });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     let seller = await Seller.findById(decoded.id);

//     if (!seller) {
//       return Response.json({ error: "Seller not found" }, { status: 404 });
//     }

//     const { name, email, profilePicture } = await req.json();

//     if (name) seller.name = name;
//     if (email) seller.email = email;
//     if (profilePicture) seller.profilePicture = profilePicture;

//     await seller.save();

//     return Response.json({ message: "Profile updated successfully", seller }, { status: 200 });

//   } catch (error) {
//     console.error("Error updating seller profile:", error);
//     return Response.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
