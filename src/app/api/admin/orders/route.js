import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

// GET all orders (admin only)
export async function GET(req) {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await getCollection("orders");
    const all = await orders
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Normalize: some docs use 'orderStatus', others use 'status'
    const normalized = all.map((o) => ({
      ...o,
      _id: o._id.toString(),
      createdAt: o.createdAt ? o.createdAt.toISOString() : null,
      status: o.status || o.orderStatus || "Pending",
      total: o.totalAmount || o.total || o.grandTotal || 0,
    }));

    return NextResponse.json({ orders: normalized });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH - update order status (and optionally deduct stock)
export async function PATCH(req) {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, status } = await req.json();
    if (!orderId || !status) {
      return NextResponse.json({ error: "orderId and status required" }, { status: 400 });
    }

    const orders = await getCollection("orders");
    const order = await orders.findOne({ _id: new ObjectId(orderId) });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // When marking as "Delivered", deduct stock for each item
    if (status === "Delivered" && order.status !== "Delivered") {
      const products = await getCollection("products");
      for (const item of order.items || []) {
        if (item._id && item.quantity) {
          await products.updateOne(
            { _id: new ObjectId(item._id) },
            { $inc: { stock: -item.quantity } }
          );
        }
      }
    }

    await orders.updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          status,
          orderStatus: status, // keep both fields in sync
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true, status });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
