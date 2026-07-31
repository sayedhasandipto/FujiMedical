"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
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
  MdCancel,
  MdNoteAlt,
  MdPayments,
} from "react-icons/md";
import { FiPackage } from "react-icons/fi";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Pending: {
    label: "Pending",
    tw: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    icon: MdPending,
  },
  Processing: {
    label: "Processing",
    tw: "bg-blue-100 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    icon: MdLocalShipping,
  },
  Shipped: {
    label: "Shipped",
    tw: "bg-indigo-100 text-indigo-700 border-indigo-200",
    dot: "bg-indigo-500",
    icon: MdLocalShipping,
  },
  Delivered: {
    label: "Delivered",
    tw: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    icon: MdCheckCircle,
  },
  Cancelled: {
    label: "Cancelled",
    tw: "bg-rose-100 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
    icon: MdCancel,
  },
};

const ALL_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

// ─── Toast notification ───────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-bold border pointer-events-auto animate-fade-in transition-all ${
            t.type === "success"
              ? "bg-emerald-600 text-white border-emerald-500"
              : "bg-rose-600 text-white border-rose-500"
          }`}
        >
          {t.type === "success" ? (
            <MdCheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <MdCancel className="w-5 h-5 shrink-0" />
          )}
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${cfg.tw}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

// ─── Status dropdown ──────────────────────────────────────────────────────────
function StatusDropdown({ currentStatus, onStatusChange, loading }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 text-slate-700 transition-all shadow-sm disabled:opacity-60 cursor-pointer"
      >
        {loading ? (
          <span className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <MdKeyboardArrowDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
        )}
        Update Status
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-30 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden w-44 py-1">
          {ALL_STATUSES.map((s) => {
            const cfg = STATUS_CONFIG[s];
            const isCurrent = s === currentStatus;
            return (
              <button
                key={s}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isCurrent) {
                    onStatusChange(s);
                    setOpen(false);
                  }
                }}
                disabled={isCurrent}
                className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold transition-all text-left cursor-pointer ${
                  isCurrent
                    ? "bg-slate-50 text-slate-400 cursor-not-allowed"
                    : "hover:bg-slate-50 text-slate-700"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                {cfg.label}
                {isCurrent && (
                  <span className="ml-auto text-[10px] text-slate-400 font-normal">current</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Order card ───────────────────────────────────────────────────────────────
function OrderCard({ order, onStatusChange, addToast }) {
  const [updating, setUpdating] = useState(false);
  const [open, setOpen] = useState(false);

  const handleStatusChange = async (newStatus) => {
    if (updating) return;
    setUpdating(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order._id, status: newStatus }),
      });
      if (res.ok) {
        onStatusChange(order._id, newStatus);
        addToast(`Order ${order.orderId || order._id.toString().slice(-6)} → ${newStatus}`, "success");
      } else {
        addToast("Failed to update status", "error");
      }
    } catch {
      addToast("Network error. Please retry.", "error");
    }
    setUpdating(false);
  };

  const createdAt = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-BD", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  const total = Number(order.total || order.totalAmount || order.grandTotal || 0);
  const itemCount = (order.items || []).reduce((sum, i) => sum + (i.quantity || 1), 0);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* ── Header row (always visible) ── */}
      <div
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between px-5 py-4 cursor-pointer select-none bg-slate-50/60 hover:bg-slate-50 transition-colors gap-3 flex-wrap"
      >
        {/* Left: icon + order ID + date */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <MdReceipt className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <p className="font-black text-slate-900 text-sm truncate">
              {order.orderId || "#" + order._id?.toString().slice(-8).toUpperCase()}
            </p>
            <p className="text-[11px] text-slate-400 font-medium">{createdAt}</p>
          </div>
        </div>

        {/* Center: customer name & item count (hidden on xs) */}
        <div className="hidden sm:block min-w-0 flex-1 px-4">
          <p className="text-sm font-bold text-slate-700 truncate">{order.customerName || "—"}</p>
          <p className="text-[11px] text-slate-400">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
        </div>

        {/* Right: badge + total + arrow */}
        <div className="flex items-center gap-3 shrink-0">
          <StatusBadge status={order.status} />
          <span className="font-black text-emerald-600 text-sm">৳{total.toFixed(2)}</span>
          <MdKeyboardArrowDown
            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* ── Expandable details ── */}
      {open && (
        <div className="border-t border-slate-100 p-5 space-y-5">
          {/* Customer info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-2.5">
              <MdPerson className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customer</p>
                <p className="text-sm font-bold text-slate-800">{order.customerName || "—"}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MdPhone className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone</p>
                <p className="text-sm font-bold text-slate-800">{order.phone || "—"}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MdLocationOn className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Address</p>
                <p className="text-sm font-bold text-slate-800">
                  {order.address || "—"}
                  {order.deliveryArea ? (
                    <span className="text-slate-500 font-normal"> ({order.deliveryArea})</span>
                  ) : null}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MdPayments className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment</p>
                <p className="text-sm font-bold text-slate-800">{order.paymentMethod || "COD"}</p>
                {order.paymentStatus && (
                  <p className="text-[11px] text-slate-500 mt-0.5">{order.paymentStatus}</p>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="flex items-start gap-2 text-xs text-slate-500 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
              <MdNoteAlt className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <span className="italic">{order.notes}</span>
            </div>
          )}

          {/* Order items list */}
          <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
              <MdShoppingBag className="w-4 h-4 text-emerald-600" />
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                Ordered Items ({(order.items || []).length})
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {(order.items || []).map((item, idx) => {
                const imgSrc =
                  item.image ||
                  `https://placehold.co/64x64/10b981/ffffff?text=${encodeURIComponent(
                    (item.name || "Item").slice(0, 2)
                  )}`;
                const lineTotal = Number(item.total || (Number(item.price || 0) * item.quantity)).toFixed(2);
                return (
                  <div key={idx} className="flex items-center gap-3 px-4 py-3">
                    <img
                      src={imgSrc}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-white shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        ৳{Number(item.price || 0).toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-black text-slate-900 shrink-0">৳{lineTotal}</span>
                  </div>
                );
              })}
            </div>

            {/* Subtotal / shipping / total footer */}
            <div className="px-4 py-3 border-t border-slate-200 bg-white space-y-1.5">
              {order.subtotal != null && (
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Subtotal</span>
                  <span>৳{Number(order.subtotal).toFixed(2)}</span>
                </div>
              )}
              {order.shippingFee != null && (
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Shipping ({order.deliveryArea || "Inside Dhaka"})</span>
                  <span>৳{Number(order.shippingFee).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-emerald-700 pt-1 border-t border-slate-100">
                <span>Grand Total</span>
                <span>৳{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Status update row */}
          <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">Current Status:</span>
              <StatusBadge status={order.status} />
            </div>
            <StatusDropdown
              currentStatus={order.status}
              onStatusChange={handleStatusChange}
              loading={updating}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

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
      (o.orderId || "").toLowerCase().includes(q) ||
      (o.address || "").toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const counts = {
    All: orders.length,
    Pending: orders.filter((o) => o.status === "Pending").length,
    Processing: orders.filter((o) => o.status === "Processing").length,
    Shipped: orders.filter((o) => o.status === "Shipped").length,
    Delivered: orders.filter((o) => o.status === "Delivered").length,
    Cancelled: orders.filter((o) => o.status === "Cancelled").length,
  };

  const totalRevenue = orders
    .filter((o) => o.status === "Delivered")
    .reduce((sum, o) => sum + Number(o.total || o.totalAmount || o.grandTotal || 0), 0);

  const statCards = [
    { label: "Total Orders", value: counts.All, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
    { label: "Pending", value: counts.Pending, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    { label: "Processing", value: counts.Processing, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
    { label: "Shipped", value: counts.Shipped, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
    { label: "Delivered", value: counts.Delivered, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { label: "Revenue", value: `৳${totalRevenue.toFixed(0)}`, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-100" },
  ];

  return (
    <div className="w-full space-y-6">
      <Toast toasts={toasts} />

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <FiPackage className="text-emerald-600 w-6 h-6" />
            Order Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage customer orders and update delivery status
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
        >
          <MdRefresh className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((s) => (
          <div
            key={s.label}
            className={`${s.bg} ${s.border} border rounded-2xl p-4 flex flex-col gap-1 shadow-sm`}
          >
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Filter Tabs + Search ── */}
      <div className="flex gap-2 flex-wrap items-center">
        {["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
              filter === f
                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-700"
            }`}
          >
            {f}
            {counts[f] != null && (
              <span
                className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                  filter === f ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {counts[f]}
              </span>
            )}
          </button>
        ))}

        {/* Search */}
        <div className="relative ml-auto min-w-0 w-full sm:w-64">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search name, phone, order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold bg-white text-slate-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10 transition-all"
          />
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm font-semibold">
          ⚠ {error}
        </div>
      )}

      {/* ── Orders List ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold">Loading orders...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
          <FiPackage className="w-12 h-12" />
          <p className="font-bold text-slate-600">No orders found</p>
          <p className="text-sm">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onStatusChange={handleStatusChange}
              addToast={addToast}
            />
          ))}
        </div>
      )}
    </div>
  );
}
