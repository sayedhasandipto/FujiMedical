"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  MdRefresh,
  MdSearch,
  MdPerson,
  MdPhone,
  MdLocationOn,
  MdShoppingBag,
  MdCheckCircle,
  MdLocalShipping,
  MdPending,
  MdReceipt,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { FiPackage } from "react-icons/fi";

const STATUS_CONFIG = {
  Pending: {
    label: "Pending",
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
    icon: MdPending,
    next: "Processing",
  },
  Processing: {
    label: "Processing",
    color: "#3b82f6",
    bg: "#eff6ff",
    border: "#bfdbfe",
    icon: MdLocalShipping,
    next: "Delivered",
  },
  Delivered: {
    label: "Delivered",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    icon: MdCheckCircle,
    next: null,
  },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  const Icon = cfg.icon;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "3px 10px",
        borderRadius: "99px",
        fontSize: "11px",
        fontWeight: "700",
        color: cfg.color,
        backgroundColor: cfg.bg,
        border: `1.5px solid ${cfg.border}`,
      }}
    >
      <Icon style={{ width: 13, height: 13 }} />
      {cfg.label}
    </span>
  );
}

function OrderCard({ order, onStatusChange }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;

  const handleStatusChange = async (newStatus) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order._id, status: newStatus }),
      });
      if (res.ok) onStatusChange(order._id, newStatus);
    } catch {}
    setLoading(false);
  };

  const total = order.total ?? order.grandTotal ?? 0;
  const createdAt = order.createdAt
    ? new Date(order.createdAt).toLocaleString("en-BD", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1.5px solid #e2e8f0",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
        marginBottom: "12px",
      }}
    >
      {/* Header Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          backgroundColor: "#f8fafc",
          borderBottom: "1px solid #f1f5f9",
          flexWrap: "wrap",
          gap: "8px",
          cursor: "pointer",
        }}
        onClick={() => setOpen((v) => !v)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              backgroundColor: "#ecfdf5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MdReceipt style={{ color: "#16a34a", width: 18, height: 18 }} />
          </div>
          <div>
            <p style={{ fontWeight: 800, fontSize: 13, color: "#0f172a" }}>
              {order.orderId || order._id?.toString().slice(-8).toUpperCase()}
            </p>
            <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{createdAt}</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <StatusBadge status={order.status} />
          <span style={{ fontWeight: 900, fontSize: 15, color: "#16a34a" }}>
            ৳{Number(total).toFixed(2)}
          </span>
          <MdKeyboardArrowDown
            style={{
              color: "#94a3b8",
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 0.2s",
              width: 20,
              height: 20,
            }}
          />
        </div>
      </div>

      {/* Expandable Details */}
      {open && (
        <div style={{ padding: "18px" }}>
          {/* Customer Info */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <MdPerson style={{ color: "#16a34a", width: 16, height: 16, marginTop: 2, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>Customer</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>
                  {order.customerName || "—"}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <MdPhone style={{ color: "#16a34a", width: 16, height: 16, marginTop: 2, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>Phone</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{order.phone || "—"}</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <MdLocationOn style={{ color: "#16a34a", width: 16, height: 16, marginTop: 2, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>Address</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>
                  {order.address || "—"}
                  {order.deliveryArea ? ` (${order.deliveryArea})` : ""}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <MdShoppingBag style={{ color: "#16a34a", width: 16, height: 16, marginTop: 2, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>Payment</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>
                  {order.paymentMethod || "Cash on Delivery"}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div
            style={{
              backgroundColor: "#f8fafc",
              borderRadius: "12px",
              padding: "12px",
              marginBottom: "14px",
              border: "1px solid #f1f5f9",
            }}
          >
            <p style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 8 }}>
              ORDER ITEMS
            </p>
            {(order.items || []).map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 0",
                  borderBottom: i < order.items.length - 1 ? "1px solid #e2e8f0" : "none",
                }}
              >
                <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>
                  {item.name}
                  <span style={{ color: "#94a3b8", fontWeight: 500, fontSize: 12 }}>
                    {" "}× {item.quantity}
                  </span>
                </span>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>
                  ৳{(Number(item.price || item.offerPrice) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
                paddingTop: "8px",
                borderTop: "2px solid #e2e8f0",
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>
                Delivery: {order.deliveryArea === "Outside Dhaka" ? "৳120" : "৳60"}
              </span>
              <span style={{ fontSize: 14, fontWeight: 900, color: "#16a34a" }}>
                Total: ৳{Number(total).toFixed(2)}
              </span>
            </div>
          </div>

          {order.notes && (
            <p style={{ fontSize: 12, color: "#64748b", marginBottom: 14, fontStyle: "italic" }}>
              📝 {order.notes}
            </p>
          )}

          {/* Status Update Buttons */}
          {cfg.next && (
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                onClick={() => handleStatusChange(cfg.next)}
                disabled={loading}
                style={{
                  padding: "9px 20px",
                  borderRadius: "10px",
                  backgroundColor: "#16a34a",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 13,
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "background 0.15s",
                }}
              >
                {loading ? (
                  <span style={{ width: 14, height: 14, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                ) : (
                  <MdCheckCircle style={{ width: 16, height: 16 }} />
                )}
                Mark as {cfg.next}
                {cfg.next === "Delivered" && " (Deducts Stock)"}
              </button>
            </div>
          )}

          {order.status === "Delivered" && (
            <p style={{ fontSize: 12, color: "#16a34a", fontWeight: 700 }}>
              ✅ Order completed. Stock has been adjusted.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const filtered = orders.filter((o) => {
    const matchFilter = filter === "All" || o.status === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (o.customerName || "").toLowerCase().includes(q) ||
      (o.phone || "").includes(q) ||
      (o.orderId || "").toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const counts = {
    All: orders.length,
    Pending: orders.filter((o) => o.status === "Pending").length,
    Processing: orders.filter((o) => o.status === "Processing").length,
    Delivered: orders.filter((o) => o.status === "Delivered").length,
  };

  const totalRevenue = orders
    .filter((o) => o.status === "Delivered")
    .reduce((sum, o) => sum + Number(o.total || o.grandTotal || 0), 0);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
              <FiPackage style={{ color: "#16a34a" }} /> Order Management
            </h1>
            <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
              Manage customer orders and update delivery status
            </p>
          </div>
          <button
            onClick={fetchOrders}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: "10px",
              backgroundColor: "#16a34a",
              color: "#fff",
              fontWeight: 700,
              fontSize: 12,
              border: "none",
              cursor: "pointer",
            }}
          >
            <MdRefresh style={{ width: 16, height: 16 }} /> Refresh
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total Orders", value: counts.All, color: "#6366f1", bg: "#eef2ff" },
          { label: "Pending", value: counts.Pending, color: "#f59e0b", bg: "#fffbeb" },
          { label: "Processing", value: counts.Processing, color: "#3b82f6", bg: "#eff6ff" },
          { label: "Delivered", value: counts.Delivered, color: "#16a34a", bg: "#f0fdf4" },
          { label: "Revenue", value: `৳${totalRevenue.toFixed(0)}`, color: "#16a34a", bg: "#f0fdf4" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              backgroundColor: "#ffffff",
              border: "1.5px solid #e2e8f0",
              borderRadius: "14px",
              padding: "16px",
              textAlign: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}
          >
            <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>{s.label}</p>
            <p style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter + Search */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        {["All", "Pending", "Processing", "Delivered"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "7px 16px",
              borderRadius: "99px",
              fontWeight: 700,
              fontSize: 12,
              border: filter === f ? "2px solid #16a34a" : "1.5px solid #e2e8f0",
              backgroundColor: filter === f ? "#f0fdf4" : "#ffffff",
              color: filter === f ? "#16a34a" : "#64748b",
              cursor: "pointer",
            }}
          >
            {f} ({counts[f] ?? 0})
          </button>
        ))}
        <div style={{ position: "relative", marginLeft: "auto", minWidth: 220 }}>
          <MdSearch style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", width: 18, height: 18 }} />
          <input
            type="text"
            placeholder="Search name, phone, order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              paddingLeft: 34,
              paddingRight: 12,
              paddingTop: 8,
              paddingBottom: 8,
              border: "1.5px solid #e2e8f0",
              borderRadius: "10px",
              fontSize: 12,
              width: "100%",
              backgroundColor: "#ffffff",
              color: "#0f172a",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Orders List */}
      {error && (
        <div style={{ padding: 16, backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, color: "#dc2626", fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
          <div style={{ width: 36, height: 36, border: "4px solid #16a34a", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}>
          <FiPackage style={{ width: 40, height: 40, margin: "0 auto 12px", display: "block" }} />
          <p style={{ fontWeight: 700 }}>No orders found</p>
        </div>
      ) : (
        filtered.map((order) => (
          <OrderCard key={order._id} order={order} onStatusChange={handleStatusChange} />
        ))
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
