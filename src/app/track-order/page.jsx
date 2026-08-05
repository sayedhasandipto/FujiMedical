"use client";

import React, { useState } from "react";
import { trackOrder } from "@/app/actions/trackActions";
import {
  MdSearch,
  MdReceipt,
  MdCheckCircle,
  MdPending,
  MdLocalShipping,
  MdCancel,
  MdPhone,
  MdPerson,
  MdPayments,
  MdLocationOn,
  MdArrowForward,
  MdInventory2,
  MdAccessTime,
  MdNoteAlt,
  MdInfo,
  MdRefresh,
} from "react-icons/md";
import { FaPrescriptionBottleAlt } from "react-icons/fa";

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Pending: {
    label: "Pending",
    pill: "bg-amber-500/10 text-amber-600 border border-amber-400/30",
    icon: MdPending,
    desc: "আপনার অর্ডার পাওয়া হয়েছে এবং প্রক্রিয়া শুরু হবে।",
  },
  Processing: {
    label: "Processing",
    pill: "bg-blue-500/10 text-blue-600 border border-blue-400/30",
    icon: MdLocalShipping,
    desc: "আপনার অর্ডার প্রস্তুত করা হচ্ছে।",
  },
  Shipped: {
    label: "Shipped",
    pill: "bg-indigo-500/10 text-indigo-600 border border-indigo-400/30",
    icon: MdLocalShipping,
    desc: "আপনার অর্ডার ডেলিভারিতে পাঠানো হয়েছে।",
  },
  Delivered: {
    label: "Delivered",
    pill: "bg-emerald-500/10 text-emerald-700 border border-emerald-400/30",
    icon: MdCheckCircle,
    desc: "আপনার অর্ডার সফলভাবে পৌঁছে দেওয়া হয়েছে।",
  },
  Cancelled: {
    label: "Cancelled",
    pill: "bg-rose-500/10 text-rose-600 border border-rose-400/30",
    icon: MdCancel,
    desc: "এই অর্ডারটি বাতিল করা হয়েছে।",
  },
};

const STATUS_STEPS = ["Pending", "Processing", "Shipped", "Delivered"];

// ── Order Card ────────────────────────────────────────────────────────────────
function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;
  const StatusIcon = cfg.icon;
  const isCancelled = order.status === "Cancelled";
  const currentStepIdx = STATUS_STEPS.indexOf(order.status);
  const total = Number(order.totalAmount || order.total || order.grandTotal || 0);

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("bn-BD", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—";

  const formattedTime = order.createdAt
    ? new Date(order.createdAt).toLocaleTimeString("en-BD", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-md overflow-hidden transition-all hover:shadow-lg">
      {/* Card Header */}
      <div
        onClick={() => setExpanded((v) => !v)}
        className="cursor-pointer px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
            <MdReceipt className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="font-black text-slate-900 text-sm">
              {order.orderId || `#${(order._id || "").slice(-8).toUpperCase()}`}
            </p>
            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
              <MdAccessTime className="w-3 h-3" />
              {formattedDate} {formattedTime && `· ${formattedTime}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black ${cfg.pill}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {cfg.label}
          </span>
          <span className="font-black text-emerald-700 text-sm bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
            ৳{total.toFixed(0)}
          </span>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-full">
            {(order.items || []).length} item{(order.items || []).length !== 1 ? "s" : ""}
          </span>
          <span className={`text-slate-400 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}>
            <MdArrowForward className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Status Description Banner */}
      <div className={`mx-5 mb-3 px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 ${cfg.pill}`}>
        <MdInfo className="w-4 h-4 shrink-0" />
        {cfg.desc}
      </div>

      {/* Progress Stepper */}
      {!isCancelled && (
        <div className="mx-5 mb-4 px-4 py-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="relative flex items-center justify-between">
            <div className="absolute left-5 right-5 top-5 h-1 bg-slate-200 -z-0" />
            <div
              className="absolute left-5 top-5 h-1 bg-emerald-500 transition-all duration-700 -z-0"
              style={{
                width:
                  currentStepIdx <= 0
                    ? "0%"
                    : `calc(${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}% - 0px)`,
              }}
            />
            {STATUS_STEPS.map((step, idx) => {
              const StepIcon = STATUS_CONFIG[step]?.icon || MdPending;
              const isActive = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <div key={step} className="flex flex-col items-center relative z-10 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isCurrent
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-500/20"
                        : isActive
                        ? "bg-emerald-50 border-emerald-500 text-emerald-600"
                        : "bg-white border-slate-200 text-slate-300"
                    }`}
                  >
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] md:text-[11px] font-bold mt-2 ${isActive ? "text-emerald-700" : "text-slate-400"}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="mx-5 mb-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-600">
          <MdCancel className="w-8 h-8 shrink-0" />
          <div>
            <p className="text-xs font-bold">এই অর্ডারটি বাতিল করা হয়েছে।</p>
            <p className="text-[10px] text-rose-400 mt-0.5">বিস্তারিত জানতে 01700-000000 নম্বরে যোগাযোগ করুন।</p>
          </div>
        </div>
      )}

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-slate-100 p-5 space-y-4">
          {/* Customer Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: MdPerson, label: "Customer", value: order.customerName || "—" },
              { icon: MdPhone, label: "Phone", value: order.phone || order.customerPhone || "—" },
              {
                icon: MdLocationOn,
                label: "Delivery Address",
                value: `${order.address || "—"}${order.deliveryArea ? ` (${order.deliveryArea})` : ""}`,
              },
              {
                icon: MdPayments,
                label: "Payment",
                value: order.paymentMethod || "Cash on Delivery",
                sub: order.paymentStatus,
              },
            ].map(({ icon: Icon, label, value, sub }) => (
              <div key={label} className="flex items-start gap-2.5 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</p>
                  <p className="text-xs font-bold text-slate-800 leading-snug mt-0.5">{value}</p>
                  {sub && <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200/60 rounded-2xl px-4 py-3 text-xs text-amber-700">
              <MdNoteAlt className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <span className="italic font-medium">{order.notes}</span>
            </div>
          )}

          {/* Ordered Items */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center gap-2">
              <MdInventory2 className="w-4 h-4 text-emerald-600" />
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                Order Items ({(order.items || []).length})
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {(order.items || []).map((item, idx) => {
                const img =
                  item.image ||
                  `https://placehold.co/48x48/10b981/ffffff?text=${encodeURIComponent(
                    (item.name || "?").slice(0, 2)
                  )}`;
                return (
                  <div key={idx} className="flex items-center gap-3 px-4 py-3 bg-white">
                    <img
                      src={img}
                      alt={item.name}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        ৳{Number(item.price || 0).toFixed(0)} × {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-black text-slate-900 shrink-0">
                      ৳{Number(item.total ?? Number(item.price || 0) * item.quantity).toFixed(0)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 space-y-1.5">
              {order.subtotal != null && (
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Subtotal</span>
                  <span>৳{Number(order.subtotal).toFixed(0)}</span>
                </div>
              )}
              {order.shippingFee != null && (
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Shipping ({order.deliveryArea || "Inside Dhaka"})</span>
                  <span>৳{Number(order.shippingFee).toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-sm text-emerald-700 pt-1.5 border-t border-slate-200 mt-1">
                <span>Grand Total</span>
                <span>৳{total.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setSearched(true);
    setOrders([]);

    const res = await trackOrder(query);
    setLoading(false);

    if (res.success) {
      setOrders(res.data);
    } else {
      setError(res.error || "No orders found.");
    }
  };

  const handleClear = () => {
    setSearched(false);
    setOrders([]);
    setQuery("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-slate-50 pb-24">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 text-white py-14 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-10 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto text-center space-y-3 relative z-10">
          <div className="inline-flex bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold items-center gap-2 text-emerald-100 border border-white/10 mb-1">
            <FaPrescriptionBottleAlt className="text-sm" />
            অর্ডার ট্র্যাকিং সিস্টেম
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            আপনার অর্ডার ট্র্যাক করুন
          </h1>
          <p className="text-emerald-100/90 text-sm max-w-lg mx-auto font-medium leading-relaxed">
            অর্ডার আইডি (যেমন FM-123456) অথবা আপনার ফোন নম্বর দিয়ে অর্ডারের সর্বশেষ অবস্থান জানুন।
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-6 relative z-10">
        {/* Search Box */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xl mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ফোন নম্বর অথবা অর্ডার আইডি লিখুন..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 text-sm bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-6 py-3.5 rounded-2xl transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer shrink-0"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Track</span>
                  <MdArrowForward />
                </>
              )}
            </button>
          </form>

          {/* Helper hints */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-[11px] font-medium text-slate-400">উদাহরণ:</span>
            <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full font-bold">FM-123456</span>
            <span className="text-[11px] bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-full font-bold">01XXXXXXXXX</span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-sm font-bold flex items-center gap-2">
            <MdCancel className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {/* Results */}
        {searched && orders.length > 0 && (
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <MdSearch className="w-4 h-4 text-emerald-500" />
                {orders.length} টি অর্ডার পাওয়া গেছে
              </h2>
              <button
                onClick={handleClear}
                className="text-xs font-bold text-slate-400 hover:text-emerald-600 transition flex items-center gap-1"
              >
                <MdRefresh className="w-4 h-4" /> Clear
              </button>
            </div>
            {orders.map((order, idx) => (
              <OrderCard key={order._id || idx} order={order} />
            ))}
          </div>
        )}

        {/* Initial empty state */}
        {!searched && (
          <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto">
              <MdReceipt className="w-8 h-8 text-emerald-500" />
            </div>
            <div className="space-y-1">
              <p className="font-black text-slate-700 text-base">অর্ডার খুঁজুন</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                উপরে আপনার অর্ডার আইডি বা ফোন নম্বর দিয়ে অর্ডারের বর্তমান অবস্থান জানুন।
              </p>
            </div>
          </div>
        )}

        {/* Help Info */}
        <div className="mt-8 bg-white border border-slate-200 rounded-3xl p-5">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
            <MdInfo className="w-4 h-4 text-emerald-500" />
            ডেলিভারি সম্পর্কিত তথ্য
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "ঢাকার ভেতরে ডেলিভারি", value: "১-২ কার্যদিবস · ৳৬০", color: "text-emerald-700" },
              { label: "ঢাকার বাইরে ডেলিভারি", value: "৩-৫ কার্যদিবস · ৳১২০", color: "text-blue-700" },
              { label: "অর্ডার বাতিল করতে", value: "01700-000000 নম্বরে কল করুন", color: "text-rose-700" },
              { label: "অর্ডারের সময়", value: "সকাল ৯টা - রাত ১০টা", color: "text-amber-700" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</p>
                <p className={`text-xs font-bold mt-0.5 ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
