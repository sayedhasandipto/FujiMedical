"use server";

import { getCollection } from "@/lib/db";
import { revalidatePath } from "next/cache";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

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

    const orderObj = {
      orderId: `FM-${Date.now().toString().slice(-6)}`,
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
        total: (item.offerPrice ? Number(item.offerPrice) : Number(item.price)) * item.quantity,
        image: item.image || "",
      })),
      subtotal: Number(subtotal),
      shippingFee: Number(shippingFee),
      totalAmount: Number(totalAmount),
      paymentMethod,
      paymentStatus: paymentMethod.includes("bKash") ? "Pending Verification (bKash)" : "Unpaid (Cash on Delivery)",
      orderStatus: "Pending",
      createdAt: new Date(),
    };

    // Attempt Express server POST first
    try {
      const res = await fetch(`${SERVER_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderObj),
      });
      if (res.ok) {
        const json = await res.json();
        revalidatePath("/admin/products");
        return { success: true, data: json.data || orderObj };
      }
    } catch (serverErr) {
      console.warn("Express server orders API unreachable, inserting directly to MongoDB:", serverErr.message);
    }

    // Direct MongoDB fallback
    const ordersCol = await getCollection("orders");
    const result = await ordersCol.insertOne(orderObj);

    // Optionally update product stock levels in MongoDB
    try {
      const productsCol = await getCollection("products");
      for (const item of cartItems) {
        if (item._id && !item._id.includes("_")) {
          await productsCol.updateOne(
            { _id: item._id },
            { $inc: { stock: -item.quantity } }
          );
        }
      }
    } catch (stockErr) {
      console.warn("Stock update warning:", stockErr.message);
    }

    revalidatePath("/admin/products");
    return {
      success: true,
      data: {
        _id: result.insertedId.toString(),
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
    const ordersCol = await getCollection("orders");
    const result = await ordersCol.find({ email: email.trim() }).sort({ createdAt: -1 }).toArray();

    // Map MongoDB ObjectIDs and Date types to clean objects
    const orders = result.map((order) => ({
      ...order,
      _id: order._id.toString(),
      createdAt: order.createdAt ? order.createdAt.toISOString() : null,
    }));

    return { success: true, data: orders };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
