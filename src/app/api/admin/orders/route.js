import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;

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

    if (!DB_URL) {
      return NextResponse.json(
        {
          success: false,
          error: "NEXT_PUBLIC_FIREBASE_DATABASE_URL is not set",
        },
        { status: 500 },
      );
    }

    // Plain REST call — no persistent SDK connection, so it can't hang.
    const res = await fetch(`${DB_URL}/orders.json`, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Firebase REST error: ${res.status}`);
    }

    const ordersData = await res.json();

    if (!ordersData) {
      return NextResponse.json({ orders: [] });
    }

    const orders = Object.entries(ordersData).map(([id, data]) => ({
      _id: id,
      ...data,
      status: data.status || data.orderStatus || "Pending",
      total: data.total ?? data.totalAmount ?? 0,
    }));

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

    if (!DB_URL) {
      return NextResponse.json(
        {
          success: false,
          error: "NEXT_PUBLIC_FIREBASE_DATABASE_URL is not set",
        },
        { status: 500 },
      );
    }

    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: "orderId and status are required" },
        { status: 400 },
      );
    }

    const res = await fetch(`${DB_URL}/orders/${orderId}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        orderStatus: status, // kept in sync for backward compatibility
        updatedAt: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      throw new Error(`Firebase REST error: ${res.status}`);
    }

    // Clear and force revalidation of caching across Next.js paths
    const { revalidatePath, revalidateTag } = await import("next/cache");
    revalidatePath("/");
    revalidatePath("/admin/orders");
    revalidatePath("/track-order");
    revalidateTag("orders");


    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
