"use server";

import { db } from "@/lib/db";
import { collection, getDocs } from "firebase/firestore";

export async function trackOrder(queryStr) {
  try {
    if (!queryStr || !queryStr.trim()) {
      return { success: false, error: "Please enter a Phone Number or Order ID" };
    }

    const trimmedQuery = queryStr.trim();
    const ordersSnapshot = await getDocs(collection(db, "orders"));
    const result = [];
    const lowerQuery = trimmedQuery.toLowerCase();

    ordersSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const orderId = (data.orderId || "").toLowerCase();
      const phone = data.phone || "";
      const customerPhone = data.customerPhone || "";

      if (
        orderId === lowerQuery ||
        phone === trimmedQuery ||
        customerPhone === trimmedQuery
      ) {
        result.push({
          _id: docSnap.id,
          ...data,
        });
      }
    });

    // Sort descending by createdAt
    result.sort((a, b) => {
      const dateA = a.createdAt ? (a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt)) : new Date(0);
      const dateB = b.createdAt ? (b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt)) : new Date(0);
      return dateB - dateA;
    });

    if (result.length === 0) {
      return { success: false, error: "No orders found matching this query" };
    }

    // Map to safe, serializable format
    const orders = result.map((order) => ({
      orderId: order.orderId,
      customerName: order.customerName,
      phone: order.phone,
      deliveryArea: order.deliveryArea,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt ? (order.createdAt.toDate ? order.createdAt.toDate().toISOString() : new Date(order.createdAt).toISOString()) : null,
      status: order.status || order.orderStatus || "Pending",
      totalAmount: order.totalAmount || (order.subtotal || 0) + (order.shippingFee || 0),
      items: (order.items || []).map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.total,
        image: item.image,
      })),
    }));

    return { success: true, data: orders };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
