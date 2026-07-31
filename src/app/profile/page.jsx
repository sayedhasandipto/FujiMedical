"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdVerified,
  MdShield,
  MdLogout,
  MdShoppingBag,
  MdReceiptLong,
  MdMedicalServices,
  MdEdit,
  MdArrowBack,
} from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { FaHeartbeat } from "react-icons/fa";
import { useSession, signOut, authClient } from "@/lib/auth-client";
import { getUserOrders } from "@/app/actions/orderActions";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Populate phone & address from session when available
  React.useEffect(() => {
    if (user?.phone) setPhone(user.phone);
    if (user?.address) setAddress(user.address);
  }, [user]);

  React.useEffect(() => {
    async function loadOrders() {
      if (user?.email) {
        setLoadingOrders(true);
        const res = await getUserOrders(user.email);
        if (res.success) {
          setOrders(res.data);
        }
        setLoadingOrders(false);
      }
    }
    loadOrders();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError("");
    try {
      const result = await authClient.updateUser({
        phone,
        address,
      });
      if (result?.error) {
        setSaveError(result.error.message || "Save failed. Please try again.");
      } else {
        setIsEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      setSaveError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-emerald-800">Loading Profile…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white border border-emerald-100 rounded-3xl p-8 shadow-xl max-w-md w-full text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
            <MdPerson className="text-emerald-600 text-3xl" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">
            Please Sign In
          </h2>
          <p className="text-slate-500 text-sm">
            You need to be signed in to view your profile page.
          </p>
          <Link
            href="/login"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/70 via-slate-50 to-emerald-50/30 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-white border border-emerald-100/80 px-3.5 py-2 rounded-xl shadow-sm hover:shadow transition-all"
          >
            <MdArrowBack className="text-base" />
            <span>Back to Home</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 text-xs font-bold text-rose-600 hover:text-rose-700 bg-white border border-rose-100 px-3.5 py-2 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <MdLogout className="text-base" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-900/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            {/* Avatar */}
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "Profile Avatar"}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
                className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500 shadow-md shrink-0"
              />
            ) : null}
            <div
              style={{ display: user.image ? "none" : "flex" }}
              className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-3xl items-center justify-center border-4 border-emerald-400 shadow-md uppercase shrink-0"
            >
              {(user.name
                ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
                : user.email?.[0] || "U"
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {user.name || "User Account"}
                </h1>
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                  <MdVerified className="text-emerald-600 text-xs" /> Verified Google Account
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-500">
                {user.email}
              </p>
              <div className="pt-2 flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-600">
                <span className="bg-slate-100 px-3 py-1 rounded-lg font-medium">
                  Member since 2026
                </span>
                <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg font-bold border border-emerald-100">
                  Fuji Medical Customer
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsEditing((v) => !v)}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <MdEdit className="text-base" />
              <span>{isEditing ? "Cancel Edit" : "Edit Profile"}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-emerald-100/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 text-2xl shrink-0">
              <MdShoppingBag />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Total Orders</p>
              <h3 className="text-xl font-black text-slate-800 mt-0.5">
                {loadingOrders ? "..." : `${orders.length} Order${orders.length !== 1 ? "s" : ""}`}
              </h3>
            </div>
          </div>

          <div className="bg-white border border-emerald-100/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 text-2xl shrink-0">
              <MdReceiptLong />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Prescriptions</p>
              <h3 className="text-xl font-black text-slate-800 mt-0.5">0 Uploaded</h3>
            </div>
          </div>

          <div className="bg-white border border-emerald-100/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 text-2xl shrink-0">
              <MdMedicalServices />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Lab Tests</p>
              <h3 className="text-xl font-black text-slate-800 mt-0.5">0 Booked</h3>
            </div>
          </div>
        </div>

        {/* Details Form Card */}
        <div className="bg-white border border-emerald-100/80 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Personal Information
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your account details and contact preferences
              </p>
            </div>
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full animate-fade-in">
                ✓ Saved Successfully!
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MdPerson className="text-emerald-600 text-base" /> Full Name
              </label>
              <input
                type="text"
                disabled
                value={user.name || ""}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 cursor-not-allowed"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MdEmail className="text-emerald-600 text-base" /> Email Address
              </label>
              <input
                type="email"
                disabled
                value={user.email || ""}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 cursor-not-allowed"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MdPhone className="text-emerald-600 text-base" /> Phone Number
              </label>
              <input
                type="tel"
                disabled={!isEditing}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1XXX XXXXXX"
                className={`w-full px-4 py-2.5 border rounded-xl text-sm font-semibold transition-all ${
                  isEditing
                    ? "bg-white border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 text-slate-900"
                    : "bg-slate-50 border-slate-200 text-slate-700 cursor-not-allowed"
                }`}
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MdLocationOn className="text-emerald-600 text-base" /> Delivery Address
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House, Road, City"
                className={`w-full px-4 py-2.5 border rounded-xl text-sm font-semibold transition-all ${
                  isEditing
                    ? "bg-white border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 text-slate-900"
                    : "bg-slate-50 border-slate-200 text-slate-700 cursor-not-allowed"
                }`}
              />
            </div>

            {isEditing && (
              <div className="sm:col-span-2 pt-2 flex flex-col items-end gap-2">
                {saveError && (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
                    ✕ {saveError}
                  </span>
                )}
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all text-xs cursor-pointer flex items-center gap-2"
                >
                  {isSaving && (
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {isSaving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* My Orders Section */}
        <div id="orders" className="bg-white border border-emerald-100/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <MdShoppingBag className="text-emerald-600" /> My Orders
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Track your shipping progress and order status
            </p>
          </div>

          {loadingOrders ? (
            <div className="py-12 text-center text-zinc-400 space-y-3">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold">Retrieving your order history...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-dashed border-emerald-100 flex flex-col items-center gap-2">
              <MdShoppingBag className="text-slate-350 w-10 h-10" />
              <p className="font-extrabold text-slate-600 text-xs">No orders found</p>
              <p className="text-[11px] text-slate-400">You haven't placed any orders yet.</p>
              <Link
                href="/"
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6 divide-y divide-slate-100 pr-1">
              {orders.map((order) => {
                const steps = ["Pending", "Processing", "Shipped", "Delivered"];
                const getStatusStep = (status) => {
                  const s = status ? status.toLowerCase() : "";
                  if (s === "processing") return 1;
                  if (s === "shipped") return 2;
                  if (s === "delivered") return 3;
                  return 0;
                };
                const currentStep = getStatusStep(order.orderStatus);

                return (
                  <div key={order._id} className="pt-6 first:pt-0 space-y-4">
                    {/* Order Details Header */}
                    <div className="flex flex-col sm:flex-row justify-between gap-3 text-xs sm:items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Order ID</span>
                        <span className="font-mono font-black text-slate-900">{order.orderId}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Date</span>
                        <span className="font-extrabold text-slate-800">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }) : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Shipping Address</span>
                        <span className="font-bold text-slate-700 truncate max-w-[200px] block">{order.address}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Payment</span>
                        <span className="font-extrabold text-slate-800">{order.paymentMethod}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Total</span>
                        <span className="font-black text-emerald-600">৳{Number(order.totalAmount || 0).toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Ordered items listing */}
                    <div className="space-y-3 pl-2">
                      {order.items && order.items.map((item, itemIdx) => {
                        const imageSrc = item.image || `https://placehold.co/80x85/10b981/ffffff?text=${encodeURIComponent(item.name || "Item")}`;
                        return (
                          <div key={itemIdx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3 min-w-0 pr-2">
                              <img
                                src={imageSrc}
                                alt={item.name}
                                className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-50"
                              />
                              <div className="min-w-0">
                                <p className="font-extrabold text-slate-800 truncate">{item.name}</p>
                                <p className="text-[10px] text-slate-400">
                                  Qty: {item.quantity} x ৳{Number(item.price || 0).toFixed(2)}
                                </p>
                              </div>
                            </div>
                            <span className="font-black text-slate-900 shrink-0">
                              ৳{Number(item.total || 0).toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Order Progress Stepper Bar */}
                    <div className="pt-2 pb-4 px-2">
                      <div className="flex items-center justify-between w-full relative">
                        {/* Stepper bar background lines */}
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0" />
                        <div
                          className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
                          style={{ width: `${(currentStep / 3) * 100}%` }}
                        />

                        {steps.map((step, idx) => {
                          const isCompleted = idx <= currentStep;
                          const isActive = idx === currentStep;
                          return (
                            <div key={step} className="flex flex-col items-center z-10 relative">
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                                  isCompleted
                                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                                    : "bg-slate-200 text-slate-500"
                                } ${isActive ? "ring-4 ring-emerald-500/25" : ""}`}
                              >
                                {idx + 1}
                              </div>
                              <span
                                className={`text-[9px] font-extrabold mt-1.5 ${
                                  isCompleted ? "text-emerald-700 font-black" : "text-slate-400"
                                }`}
                              >
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Security & Provider Info */}
        <div className="bg-white border border-emerald-100/80 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <FcGoogle className="text-2xl" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">
                Connected Google Account
              </h4>
              <p className="text-[11px] font-semibold text-slate-500">
                Logged in via Google OAuth 2.0
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full">
            <MdShield className="text-emerald-600" /> Active
          </span>
        </div>
      </div>
    </div>
  );
}
