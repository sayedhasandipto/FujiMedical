"use server";

import { getCollection } from "@/lib/db";

export async function trackOrder(query) {
  try {
    if (!query || !query.trim()) {
      return { success: false, error: "Please enter a Phone Number or Order ID" };
    }

    const trimmedQuery = query.trim();
    const ordersCol = await getCollection("orders");

    // Search by orderId (case-insensitive) OR phone/customerPhone
    const result = await ordersCol.find({
      $or: [
        { orderId: { $regex: new RegExp(`^${trimmedQuery}$`, "i") } },
        { phone: trimmedQuery },
        { customerPhone: trimmedQuery }
      ]
    }).sort({ createdAt: -1 }).toArray();

    if (!result || result.length === 0) {
      return { success: false, error: "No orders found matching this query" };
    }

    // Map to safe, serializable format
    const orders = result.map((order) => ({
      orderId: order.orderId,
      customerName: order.customerName,
      phone: order.phone,
      deliveryArea: order.deliveryArea,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt ? order.createdAt.toISOString() : null,
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
