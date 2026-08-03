import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";

// Helper function to check admin authentication via httpOnly cookie
async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return token === "authenticated";
}

// GET all orders (admin only)
export async function GET(req) {
  try {
    // 1. Verify admin session via cookie
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch orders from Firestore
    const querySnapshot = await getDocs(collection(db, "orders"));
    const all = [];
    querySnapshot.forEach((docSnap) => {
      all.push({
        _id: docSnap.id,
        ...docSnap.data(),
      });
    });

    // 3. Sort descending by createdAt
    all.sort((a, b) => {
      const dateA = a.createdAt
        ? a.createdAt.toDate
          ? a.createdAt.toDate()
          : new Date(a.createdAt)
        : new Date(0);
      const dateB = b.createdAt
        ? b.createdAt.toDate
          ? b.createdAt.toDate()
          : new Date(b.createdAt)
        : new Date(0);
      return dateB - dateA;
    });

    // 4. Normalize fields
    const normalized = all.map((o) => ({
      ...o,
      _id: o._id,
      createdAt: o.createdAt
        ? o.createdAt.toDate
          ? o.createdAt.toDate().toISOString()
          : new Date(o.createdAt).toISOString()
        : null,
      status: o.status || o.orderStatus || "Pending",
      total: o.totalAmount || o.total || o.grandTotal || 0,
    }));

    return NextResponse.json({ orders: normalized });
  } catch (err) {
    console.error("Error fetching orders:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH - update order status (and optionally deduct stock)
export async function PATCH(req) {
  try {
    // 1. Verify admin session via cookie
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, status } = await req.json();
    if (!orderId || !status) {
      return NextResponse.json(
        { error: "orderId and status required" },
        { status: 400 },
      );
    }

    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await getDoc(orderRef);
    if (!orderSnap.exists()) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    const order = orderSnap.data();

    // When marking as "Delivered", deduct stock for each item
    if (status === "Delivered" && order.status !== "Delivered") {
      for (const item of order.items || []) {
        if (item._id && item.quantity) {
          const productRef = doc(db, "products", item._id);
          await updateDoc(productRef, {
            stock: increment(-item.quantity),
          });
        }
      }
    }

    await updateDoc(orderRef, {
      status,
      orderStatus: status, // keep both fields in sync
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, status });
  } catch (err) {
    console.error("Error updating order:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
