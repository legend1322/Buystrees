import { connectDB } from "@/lib/db";
import Admin from "@/models/admin/Admin";
import { authenticateAdmin } from "@/middleware/admin/authAdmin";

export async function GET(req) {
  try {
    await connectDB();

    const admin = await authenticateAdmin(req);

    if (!admin) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // ❌ Reject if not superadmin
    if (admin.role !== "superadmin") {
      return new Response(JSON.stringify({ error: "Access denied: Superadmin only" }), { status: 403 });
    }

    // ✅ Fetch all admins except superadmin
    const admins = await Admin.find({ role: { $ne: "superadmin" } });

    return new Response(JSON.stringify(admins), { status: 200 });
  } catch (error) {
    console.error("Error fetching admins:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
