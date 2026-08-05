"use server";

const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;

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

    if (!DB_URL) {
      return { success: false, error: "Database not configured." };
    }

    const res = await fetch(`${DB_URL}/orders.json`, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Firebase REST error: ${res.status}`);
    }

    const ordersData = await res.json();

    if (!ordersData) {
      return { success: false, error: "No orders found." };
    }

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
