"use server";

import { db } from "@/lib/firebase";
import { ref, get } from "firebase/database";

// Searches orders by Order ID (e.g. "FM-123456") or phone number.
// No login required — matches the customer-facing TrackOrderPage.
export async function trackOrder(query) {
  try {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return {
        success: false,
        error: "Please enter an Order ID or phone number.",
      };
    }

    const ordersRef = ref(db, "orders");
    const snapshot = await get(ordersRef);

    if (!snapshot.exists()) {
      return { success: false, error: "No orders found." };
    }

    const ordersData = snapshot.val();
    const queryLower = trimmedQuery.toLowerCase();

    const matches = Object.entries(ordersData)
      .map(([id, data]) => ({ _id: id, ...data }))
      .filter((order) => {
        const orderIdMatch = (order.orderId || "").toLowerCase() === queryLower;
        const phoneMatch =
          (order.phone || "").replace(/\s+/g, "") ===
            trimmedQuery.replace(/\s+/g, "") ||
          (order.customerPhone || "").replace(/\s+/g, "") ===
            trimmedQuery.replace(/\s+/g, "");
        return orderIdMatch || phoneMatch;
      })
      .map((order) => ({
        ...order,
        // Normalize status field — some orders may have been saved as
        // "orderStatus" instead of "status"
        status: order.status || order.orderStatus || "Pending",
      }));

    if (matches.length === 0) {
      return {
        success: false,
        error: "No orders found with that Order ID or phone number.",
      };
    }

    // Sort newest first
    matches.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA;
    });

    return { success: true, data: matches };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
