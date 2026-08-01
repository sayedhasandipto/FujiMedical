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
} from "react-icons/md";
import { FaPrescriptionBottleAlt } from "react-icons/fa";
import Link from "next/link";

const STATUS_STEPS = ["Pending", "Processing", "Shipped", "Delivered"];

const STATUS_ICONS = {
  Pending: MdPending,
  Processing: MdLocalShipping,
  Shipped: MdLocalShipping,
  Delivered: MdCheckCircle,
  Cancelled: MdCancel,
};

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

    const res = await trackOrder(query);
    setLoading(false);

    if (res.success) {
      setOrders(res.data);
    } else {
      setOrders([]);
      setError(res.error || "No orders found.");
    }
  };

  const getStepIndex = (status) => {
    return STATUS_STEPS.indexOf(status);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-24 transition-colors duration-200 relative overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white py-12 px-4 shadow-lg relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold items-center gap-1.5 text-emerald-100 border border-white/10 mb-2">
            <FaPrescriptionBottleAlt className="text-sm" /> Track Order Status
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            অর্ডার ট্র্যাক করুন
          </h1>
          <p className="text-emerald-100 text-xs md:text-sm max-w-lg mx-auto font-medium">
            Enter your Order ID (e.g. FM-123456) or your phone number to check the status of your medicine delivery.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8 relative z-10">
        {/* Search bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl p-6 shadow-xl max-w-xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                required
                placeholder="Phone Number or Order ID..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-6 py-3 rounded-2xl transition shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
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
        </div>

        {/* Error message */}
        {error && (
          <div className="max-w-xl mx-auto p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs font-bold text-center">
            {error}
          </div>
        )}

        {/* Initial message state */}
        {!searched && (
          <div className="text-center py-16 text-slate-400 space-y-2">
            <MdReceipt className="w-12 h-12 mx-auto text-slate-350 dark:text-slate-700" />
            <p className="font-bold text-slate-500 text-sm">No Active Search</p>
            <p className="text-xs text-slate-400">Search using your order reference to display status.</p>
          </div>
        )}

        {/* Orders list */}
        {searched && orders.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest text-center">
              Found {orders.length} Order{orders.length > 1 ? "s" : ""}
            </h2>

            {orders.map((order, index) => {
              const currentStepIdx = getStepIndex(order.status);
              const isCancelled = order.status === "Cancelled";

              return (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6"
                >
                  {/* Order Top Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40 flex items-center justify-center shrink-0">
                        <MdReceipt className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 dark:text-white text-base">
                          {order.orderId}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-medium">
                          Placed on: {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-BD", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }) : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-500">Status:</span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${
                          isCancelled
                            ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                            : order.status === "Delivered"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Stepper Status Progress */}
                  {!isCancelled ? (
                    <div className="py-6 px-2">
                      <div className="relative flex items-center justify-between">
                        {/* Connecting Line */}
                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 dark:bg-slate-800 -z-0" />
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-600 transition-all duration-500 -z-0"
                          style={{
                            width: `${(Math.max(0, currentStepIdx) / (STATUS_STEPS.length - 1)) * 100}%`,
                          }}
                        />

                        {/* Steps */}
                        {STATUS_STEPS.map((step, stepIdx) => {
                          const StepIcon = STATUS_ICONS[step];
                          const isActive = stepIdx <= currentStepIdx;
                          const isCurrent = stepIdx === currentStepIdx;

                          return (
                            <div key={step} className="flex flex-col items-center relative z-10">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                                  isCurrent
                                    ? "bg-emerald-600 text-white border-emerald-600 ring-4 ring-emerald-600/20"
                                    : isActive
                                    ? "bg-emerald-50 dark:bg-slate-900 text-emerald-600 border-emerald-600"
                                    : "bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800"
                                }`}
                              >
                                <StepIcon className="w-5 h-5" />
                              </div>
                              <span
                                className={`text-[10px] md:text-xs font-bold mt-2 bg-slate-50 dark:bg-slate-900 px-1 rounded ${
                                  isActive
                                    ? "text-emerald-700 dark:text-emerald-400 font-extrabold"
                                    : "text-slate-450 dark:text-slate-505"
                                }`}
                              >
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex items-center gap-3 text-rose-550">
                      <MdCancel className="w-8 h-8 text-rose-500 shrink-0" />
                      <div>
                        <p className="text-xs font-bold">This order has been Cancelled</p>
                        <p className="text-[10px] text-rose-450 mt-0.5">Please contact customer support for details.</p>
                      </div>
                    </div>
                  )}

                  {/* Summary Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-850/30 rounded-2xl p-4 md:p-6 border border-slate-100 dark:border-slate-800/80 text-xs">
                    {/* Shipping Address */}
                    <div className="space-y-2 border-b md:border-b-0 md:border-r border-slate-200/60 dark:border-slate-800/60 pb-4 md:pb-0 md:pr-6">
                      <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                        Shipping & Customer Details
                      </h4>
                      <div className="space-y-1.5 font-medium text-slate-650 dark:text-slate-350">
                        <p className="flex items-center gap-2">
                          <MdPerson className="text-slate-400 text-sm shrink-0" />
                          <span>{order.customerName}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <MdPhone className="text-slate-400 text-sm shrink-0" />
                          <span>{order.phone}</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <MdLocationOn className="text-slate-400 text-sm shrink-0 mt-0.5" />
                          <span>{order.deliveryArea} - {order.deliveryArea.includes("Inside") ? "৳60 delivery charge" : "৳120 delivery charge"}</span>
                        </p>
                      </div>
                    </div>

                    {/* Order summary */}
                    <div className="space-y-2 md:pl-2">
                      <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                        Order items
                      </h4>
                      <div className="max-h-36 overflow-y-auto divide-y divide-slate-150 dark:divide-slate-800/50 pr-1">
                        {(order.items || []).map((item, idx) => (
                          <div key={idx} className="flex justify-between py-2 first:pt-0">
                            <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                              {item.name} × {item.quantity}
                            </span>
                            <span className="font-black text-slate-900 dark:text-white">
                              ৳{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between font-black text-emerald-600 dark:text-emerald-400 text-sm">
                        <span>Total Paid/Payable</span>
                        <span>৳{order.totalAmount?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
