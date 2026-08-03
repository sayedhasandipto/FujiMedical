"use server";

import { db } from "@/lib/firebase";
import { revalidatePath } from "next/cache";
import { ref, get, push, set, update } from "firebase/database";

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

    // Fallback: write directly to Realtime Database under "orders"
    const ordersRef = ref(db, "orders");
    const newOrderRef = push(ordersRef);
    await set(newOrderRef, orderObj);

    // Decrement product stock levels
    try {
      for (const item of cartItems) {
        if (!item._id) continue;
        const productRef = ref(db, `products/${item._id}`);
        const snapshot = await get(productRef);
        if (snapshot.exists()) {
          const currentStock = Number(snapshot.val().stock) || 0;
          const newStock = Math.max(0, currentStock - Number(item.quantity));
          await update(productRef, { stock: newStock });
        }
      }
    } catch (stockErr) {
      console.warn("Stock update warning:", stockErr.message);
    }

    revalidatePath("/admin/orders");
    revalidatePath("/admin/products");

    return {
      success: true,
      data: {
        _id: newOrderRef.key,
        ...orderObj,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getUserOrders(email) {
  try {
    if (!email) {
      return { success: false, error: "Email is required" };
    }

    const ordersRef = ref(db, "orders");
    const snapshot = await get(ordersRef);

    if (!snapshot.exists()) {
      return { success: true, data: [] };
    }

    const ordersData = snapshot.val();
    const trimmedEmail = email.trim().toLowerCase();

    const orders = Object.entries(ordersData)
      .map(([id, data]) => ({ _id: id, ...data }))
      .filter(
        (order) => (order.email || "").trim().toLowerCase() === trimmedEmail,
      );

    // Sort descending by createdAt
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

export async function getAllOrders() {
  try {
    const ordersRef = ref(db, "orders");
    const snapshot = await get(ordersRef);

    if (!snapshot.exists()) {
      return { success: true, data: [] };
    }

    const ordersData = snapshot.val();
    const orders = Object.entries(ordersData).map(([id, data]) => ({
      _id: id,
      ...data,
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
    await update(ref(db, `orders/${id}`), { orderStatus });
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
