// app/api/admin/admins/[id]/route.js

import { connectDB } from "@/lib/db";
import Admin from "@/models/admin/Admin";
import { authenticateAdmin } from "@/middleware/admin/authAdmin";
import bcrypt from "bcryptjs";

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const admin = await authenticateAdmin(req);
    if (!admin || admin.role !== "superadmin") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }

    const { id } = await params;

    if (admin._id.toString() === id) {
      return new Response(JSON.stringify({ error: "Cannot delete yourself" }), { status: 400 });
    }

    const deletedAdmin = await Admin.findByIdAndDelete(id);

    if (!deletedAdmin) {
      return new Response(JSON.stringify({ error: "Admin not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Admin deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting admin:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const admin = await authenticateAdmin(req);
    if (!admin || admin.role !== "superadmin") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const { name, email, password, role } = body;

    const updateFields = { name, email, role };
    if (password) {
      updateFields.password = await bcrypt.hash(password, 10);
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedAdmin) {
      return new Response(JSON.stringify({ error: "Admin not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Admin updated successfully", admin: updatedAdmin }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating admin:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
