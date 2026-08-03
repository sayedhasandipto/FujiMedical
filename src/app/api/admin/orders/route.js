import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { cookies } from "next/headers";
import { ref, get, update } from "firebase/database";

// Admin Verification using HTTP-only Cookie (same system as the rest of the project)
async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return token === "authenticated";
}

// GET /api/admin/orders — returns all orders for the admin dashboard
export async function GET() {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin access required" },
        { status: 403 },
      );
    }

    const ordersRef = ref(db, "orders");
    const snapshot = await get(ordersRef);

    if (!snapshot.exists()) {
      return NextResponse.json({ orders: [] });
    }

    const ordersData = snapshot.val();

    const orders = Object.entries(ordersData).map(([id, data]) => ({
      _id: id,
      ...data,
      // Normalize status field: older orders may have been saved as
      // "orderStatus", newer ones as "status" — always expose "status".
      status: data.status || data.orderStatus || "Pending",
      total: data.total ?? data.totalAmount ?? 0,
    }));

    // Sort newest first
    orders.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA;
    });

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// PATCH /api/admin/orders — updates an order's status
export async function PATCH(req) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin access required" },
        { status: 403 },
      );
    }

    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: "orderId and status are required" },
        { status: 400 },
      );
    }

    await update(ref(db, `orders/${orderId}`), {
      status,
      orderStatus: status, // kept in sync for backward compatibility
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
