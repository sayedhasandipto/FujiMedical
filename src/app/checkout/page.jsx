"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/app/actions/orderActions";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import {
  MdShoppingBag,
  MdLocalShipping,
  MdCheckCircle,
  MdArrowBack,
  MdPerson,
  MdPhone,
  MdHome,
  MdNoteAlt,
  MdPayments,
} from "react-icons/md";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart, isMounted } = useCart();

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    deliveryArea: "Inside Dhaka",
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [bKashPhone, setBKashPhone] = useState("");
  const [bKashTxnId, setBKashTxnId] = useState("");
  const [shippingFee, setShippingFee] = useState(60);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [completedOrder, setCompletedOrder] = useState(null);

  const handleDeliveryAreaChange = (area) => {
    setForm({ ...form, deliveryArea: area });
    setShippingFee(area === "Inside Dhaka" ? 60 : 120);
  };

  const totalAmount = subtotal + shippingFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerName.trim() || !form.phone.trim() || !form.address.trim()) {
      setErrorMsg("Please fill in your Name, Phone Number, and Full Address.");
      return;
    }

    if (paymentMethod === "bKash" && (!bKashPhone.trim() || !bKashTxnId.trim())) {
      setErrorMsg("Please provide your bKash Mobile Number and Transaction ID.");
      return;
    }

    if (cart.length === 0) {
      setErrorMsg("Your cart is empty. Please add items to checkout.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    const orderPayload = {
      ...form,
      cartItems: cart,
      subtotal,
      shippingFee,
      totalAmount,
      paymentMethod: paymentMethod === "bKash" ? `bKash (Phone: ${bKashPhone.trim()}, TxnID: ${bKashTxnId.trim()})` : "Cash on Delivery",
      email: "",
    };

    const res = await createOrder(orderPayload);
    setSubmitting(false);

    if (res.success) {
      setCompletedOrder(res.data);
      clearCart();
    } else {
      setErrorMsg(res.error || "Failed to place order. Please try again.");
    }
  };

  if (!isMounted) return null;

  // Render Order Confirmation Screen if order was completed
  if (completedOrder) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-12 px-4 flex items-center justify-center">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 max-w-lg w-full shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
            <MdCheckCircle className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              Order Confirmed
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
              Thank You for Your Order!
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Your order has been placed successfully with Cash on Delivery.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 text-left space-y-2 text-xs">
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <span className="text-slate-500">Order ID:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {completedOrder.orderId || "FM-100234"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Customer:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {completedOrder.customerName} ({completedOrder.phone})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Address:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                {completedOrder.address}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {completedOrder.paymentMethod} (৳{completedOrder.totalAmount?.toFixed(2)})
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition shadow-lg shadow-emerald-600/20 text-center"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 max-w-md w-full shadow-xl space-y-4">
          <MdShoppingBag className="w-16 h-16 text-slate-400 mx-auto" />
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Your Cart is Empty
          </h2>
          <p className="text-xs text-slate-500">
            Please add medicines or products to your cart before proceeding to checkout.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition"
          >
            <MdArrowBack /> Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-24">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-600 text-white py-8 px-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2">
              <MdLocalShipping /> Checkout & Delivery
            </h1>
            <p className="text-emerald-100 text-xs md:text-sm mt-1">
              Complete your shipping details to receive your order with Cash on Delivery.
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition"
          >
            <MdArrowBack /> Back to Cart
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Information Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl space-y-6" style={{backgroundColor: "#ffffff"}}>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <MdPerson className="text-emerald-600" /> Customer Information
              </h2>

              {errorMsg && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <MdPerson className="absolute left-3.5 top-3.5 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    style={{
                      width: "100%",
                      backgroundColor: "#ffffff",
                      border: "1.5px solid #d1d5db",
                      borderRadius: "12px",
                      paddingLeft: "44px",
                      paddingRight: "16px",
                      paddingTop: "12px",
                      paddingBottom: "12px",
                      fontSize: "14px",
                      color: "#0f172a",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Mobile Phone Number *
                </label>
                <div className="relative">
                  <MdPhone className="absolute left-3.5 top-3.5 text-slate-400 w-5 h-5" />
                  <input
                    type="tel"
                    required
                    placeholder="01826637443"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    style={{
                      width: "100%",
                      backgroundColor: "#ffffff",
                      border: "1.5px solid #d1d5db",
                      borderRadius: "12px",
                      paddingLeft: "44px",
                      paddingRight: "16px",
                      paddingTop: "12px",
                      paddingBottom: "12px",
                      fontSize: "14px",
                      color: "#0f172a",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Delivery Area Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Delivery Area *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleDeliveryAreaChange("Inside Dhaka")}
                    style={{
                      padding: "16px",
                      borderRadius: "16px",
                      border: form.deliveryArea === "Inside Dhaka" ? "2px solid #16a34a" : "1.5px solid #d1d5db",
                      backgroundColor: form.deliveryArea === "Inside Dhaka" ? "#f0fdf4" : "#ffffff",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <p style={{fontSize: "12px", fontWeight: "800", color: form.deliveryArea === "Inside Dhaka" ? "#15803d" : "#374151"}}>Inside Dhaka</p>
                    <p style={{fontSize: "11px", fontWeight: "700", color: "#16a34a", marginTop: "4px"}}>Delivery: ৳60</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeliveryAreaChange("Outside Dhaka")}
                    style={{
                      padding: "16px",
                      borderRadius: "16px",
                      border: form.deliveryArea === "Outside Dhaka" ? "2px solid #16a34a" : "1.5px solid #d1d5db",
                      backgroundColor: form.deliveryArea === "Outside Dhaka" ? "#f0fdf4" : "#ffffff",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <p style={{fontSize: "12px", fontWeight: "800", color: form.deliveryArea === "Outside Dhaka" ? "#15803d" : "#374151"}}>Outside Dhaka</p>
                    <p style={{fontSize: "11px", fontWeight: "700", color: "#16a34a", marginTop: "4px"}}>Delivery: ৳120</p>
                  </button>
                </div>
              </div>

              {/* Full Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Shipping Address *
                </label>
                <div className="relative">
                  <MdHome className="absolute left-3.5 top-3.5 text-slate-400 w-5 h-5" />
                  <textarea
                    rows={3}
                    required
                    placeholder="House/Holding no, Road, Area, Thana, District..."
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    style={{
                      width: "100%",
                      backgroundColor: "#ffffff",
                      border: "1.5px solid #d1d5db",
                      borderRadius: "12px",
                      paddingLeft: "44px",
                      paddingRight: "16px",
                      paddingTop: "12px",
                      paddingBottom: "12px",
                      fontSize: "14px",
                      color: "#0f172a",
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                </div>
              </div>

              {/* Special Instructions / Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Order Notes / Special Instructions
                </label>
                <div className="relative">
                  <MdNoteAlt className="absolute left-3.5 top-3.5 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="e.g. Call before delivery, deliver after 3 PM"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    style={{
                      width: "100%",
                      backgroundColor: "#ffffff",
                      border: "1.5px solid #d1d5db",
                      borderRadius: "12px",
                      paddingLeft: "44px",
                      paddingRight: "16px",
                      paddingTop: "12px",
                      paddingBottom: "12px",
                      fontSize: "14px",
                      color: "#0f172a",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Payment Method Option */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5">
                  Payment Method *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Cash on Delivery")}
                    style={{
                      padding: "16px",
                      borderRadius: "16px",
                      border: paymentMethod === "Cash on Delivery" ? "2px solid #16a34a" : "1.5px solid #d1d5db",
                      backgroundColor: paymentMethod === "Cash on Delivery" ? "#f0fdf4" : "#ffffff",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <p style={{fontSize: "12px", fontWeight: "800", color: paymentMethod === "Cash on Delivery" ? "#15803d" : "#374151"}}>Cash on Delivery</p>
                    <p style={{fontSize: "11px", color: "#6b7280", marginTop: "4px"}}>Pay cash at your doorstep</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bKash")}
                    style={{
                      padding: "16px",
                      borderRadius: "16px",
                      border: paymentMethod === "bKash" ? "2px solid #d946ef" : "1.5px solid #d1d5db",
                      backgroundColor: paymentMethod === "bKash" ? "#fdf4ff" : "#ffffff",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <p style={{fontSize: "12px", fontWeight: "800", color: paymentMethod === "bKash" ? "#a21caf" : "#374151"}}>bKash Mobile Banking</p>
                    <p style={{fontSize: "11px", color: "#6b7280", marginTop: "4px"}}>Send money to 01826637443</p>
                  </button>
                </div>

                {paymentMethod === "bKash" && (
                  <div className="mt-4 p-4 rounded-2xl bg-fuchsia-50/50 border border-fuchsia-200 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="text-xs text-fuchsia-800">
                      <p className="font-bold">Instructions:</p>
                      <p className="mt-1">Please Send Money ৳{totalAmount.toFixed(2)} to our Merchant Account: <strong>01826637443</strong>. Then enter your bKash mobile number and the Transaction ID below.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">bKash Number</label>
                        <input
                          type="tel"
                          placeholder="017xxxxxxxx"
                          value={bKashPhone}
                          onChange={(e) => setBKashPhone(e.target.value)}
                          style={{
                            width: "100%",
                            backgroundColor: "#ffffff",
                            border: "1.5px solid #d1d5db",
                            borderRadius: "10px",
                            padding: "8px 12px",
                            fontSize: "13px",
                            color: "#0f172a",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Transaction ID (TxnID)</label>
                        <input
                          type="text"
                          placeholder="e.g. BKA87K2J4"
                          value={bKashTxnId}
                          onChange={(e) => setBKashTxnId(e.target.value)}
                          style={{
                            width: "100%",
                            backgroundColor: "#ffffff",
                            border: "1.5px solid #d1d5db",
                            borderRadius: "10px",
                            padding: "8px 12px",
                            fontSize: "13px",
                            color: "#0f172a",
                            outline: "none",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6 sticky top-24">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <MdShoppingBag className="text-emerald-600" /> Order Summary
              </h2>

              {/* Item List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-slate-100 dark:divide-slate-800">
                {cart.map((item) => {
                  const itemPrice =
                    item.offerPrice !== null && item.offerPrice !== undefined
                      ? Number(item.offerPrice)
                      : Number(item.price);
                  const imageSrc = item.image || `https://placehold.co/80x80/10b981/ffffff?text=${encodeURIComponent(item.name || "Item")}`;
                  return (
                    <div key={item._id} className="flex items-center justify-between text-xs pt-3 first:pt-0">
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <img
                          src={imageSrc}
                          alt={item.name || "Item"}
                          onError={(e) => {
                            e.currentTarget.src = `https://placehold.co/80x80/10b981/ffffff?text=${encodeURIComponent(item.name || "Item")}`;
                          }}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100"
                        />
                        <div className="min-w-0">
                          <p className="font-extrabold text-slate-800 dark:text-slate-200 truncate">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Qty: {item.quantity} x ৳{itemPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <span className="font-black text-slate-900 dark:text-white shrink-0">
                        ৳{(itemPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Calculation Summary */}
              <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    ৳{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>Delivery Charge ({form.deliveryArea})</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    ৳{shippingFee.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-3 border-t border-slate-200 dark:border-slate-800">
                  <span>Total Payable</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    ৳{totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                isLoading={submitting}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/20"
              >
                <MdCheckCircle className="w-5 h-5 mr-1" />
                <span>Confirm Order ({paymentMethod})</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
