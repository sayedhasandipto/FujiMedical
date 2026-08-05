"use server";

import { revalidatePath, revalidateTag } from "next/cache";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export async function createOrder(orderData) {
  try {
    const {
      customerName,
      phone,
      address,
      deliveryArea,
      notes,
      cartItems,
      subtotal,
      shippingFee,
      totalAmount,
      paymentMethod = "Cash on Delivery",
      email = "",
    } = orderData;

    if (!customerName || !phone || !address) {
      return { success: false, error: "Name, phone, and address are required" };
    }

    if (!cartItems || cartItems.length === 0) {
      return { success: false, error: "Cart is empty" };
    }

    const orderId = `FM-${Date.now().toString().slice(-6)}`;

    const orderObj = {
      orderId,
      customerName: customerName.trim(),
      customerPhone: phone.trim(),
      phone: phone.trim(), // Keep phone for compatibility/admin UI
      address: address.trim(),
      deliveryArea: deliveryArea || "Inside Dhaka",
      notes: notes ? notes.trim() : "",
      email: email ? email.trim() : "",
      items: cartItems.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.offerPrice ? Number(item.offerPrice) : Number(item.price),
        quantity: item.quantity,
        total:
          (item.offerPrice ? Number(item.offerPrice) : Number(item.price)) *
          item.quantity,
        image: item.image || "",
      })),
      subtotal: Number(subtotal),
      shippingFee: Number(shippingFee),
      totalAmount: Number(totalAmount),
      paymentMethod,
      paymentStatus: paymentMethod.includes("bKash")
        ? "Pending Verification (bKash)"
        : "Unpaid (Cash on Delivery)",
      orderStatus: "Pending",
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    // Optional: try external Express server first
    try {
      const res = await fetch(`${SERVER_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderObj),
      });
      if (res.ok) {
        const json = await res.json();
        revalidatePath("/admin/orders");
        revalidatePath("/admin/products");
        return { success: true, data: json.data || orderObj };
      }
    } catch (serverErr) {
      console.warn(
        "Express server orders API unreachable, falling back to Firebase:",
        serverErr.message,
      );
    }

    // Fallback: write directly to Firebase Realtime Database via REST API
    const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
    if (!DB_URL) {
      return { success: false, error: "Firebase database URL not configured" };
    }

    const pushRes = await fetch(`${DB_URL}/orders.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderObj),
    });

    if (!pushRes.ok) {
      const errText = await pushRes.text();
      throw new Error(`Firebase REST error ${pushRes.status}: ${errText}`);
    }

    const pushData = await pushRes.json();
    const newKey = pushData.name; // Firebase returns { name: "-abc123" }

    revalidatePath("/admin/orders");
    revalidatePath("/admin/products");

    return {
      success: true,
      data: {
        _id: newKey,
        ...orderObj,
      },
    };
  } catch (error) {
    console.error("createOrder error:", error);
    return { success: false, error: error.message };
  }
}


export async function getAllOrders() {
  try {
    const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
    if (!DB_URL) {
      return { success: false, error: "Firebase database URL not configured" };
    }

    const res = await fetch(`${DB_URL}/orders.json`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Firebase REST error: ${res.status}`);
    }

    const ordersData = await res.json();

    if (!ordersData) {
      return { success: true, data: [] };
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

    return { success: true, data: orders };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateOrderStatus(id, orderStatus) {
  try {
    const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
    if (!DB_URL) {
      return { success: false, error: "Firebase database URL not configured" };
    }

    const res = await fetch(`${DB_URL}/orders/${id}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderStatus,
        status: orderStatus,
        updatedAt: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      throw new Error(`Firebase REST error: ${res.status}`);
    }

    revalidatePath("/");
    revalidatePath("/admin/orders");
    revalidatePath("/track-order");
    revalidateTag("orders");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
