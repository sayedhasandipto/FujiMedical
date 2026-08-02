"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@heroui/react";
import {
  MdShoppingCart,
  MdAdd,
  MdRemove,
  MdDeleteOutline,
  MdArrowBack,
  MdArrowForward,
  MdLocalShipping,
  MdShoppingBag,
} from "react-icons/md";
export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, subtotal, totalCount, isMounted } = useCart();
  const router = useRouter();


  const handleCheckoutClick = () => {
    router.push("/checkout");
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 max-w-md w-full shadow-xl space-y-5">
          <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-slate-800 flex items-center justify-center mx-auto">
            <MdShoppingCart className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Your Cart is Empty
          </h2>
          <p className="text-sm text-slate-500">
            Browse our pharmacy products and add medicines to your cart.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/20"
          >
            <MdArrowBack /> Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 relative">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-600 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2">
              <MdShoppingBag /> Shopping Cart
            </h1>
            <p className="text-emerald-100 text-xs mt-1">
              {totalCount} {totalCount === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition"
          >
            <MdArrowBack /> Continue Shopping
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-7 space-y-4">
            {cart.map((item) => {
              const priceToUse =
                item.offerPrice !== null && item.offerPrice !== undefined
                  ? Number(item.offerPrice)
                  : Number(item.price);
              const imageSrc =
                item.image ||
                `https://placehold.co/120x120/10b981/ffffff?text=${encodeURIComponent(
                  item.name || "Item"
                )}`;

              return (
                <div
                  key={item._id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <img
                    src={imageSrc}
                    alt={item.name || "Product"}
                    onError={(e) => {
                      e.currentTarget.src = `https://placehold.co/120x120/10b981/ffffff?text=${encodeURIComponent(
                        item.name || "Item"
                      )}`;
                    }}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100"
                  />

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white truncate">
                          {item.name}
                        </h3>
                        {item.category && (
                          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 mt-1 inline-block">
                            {item.category}
                          </span>
                        )}
                        {item.unit && (
                          <p className="text-[11px] text-slate-400 mt-1">{item.unit}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-slate-400 hover:text-red-500 transition p-1 shrink-0"
                        title="Remove item"
                      >
                        <MdDeleteOutline className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Price & Quantity Row */}
                    <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                      <div>
                        <span className="font-black text-lg text-emerald-600 dark:text-emerald-400">
                          ৳{(priceToUse * item.quantity).toFixed(2)}
                        </span>
                        <span className="text-[11px] text-slate-400 ml-1">
                          (৳{priceToUse.toFixed(2)} each)
                        </span>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="qty-wrapper-sm">
                        <button
                          className="qty-btn-sm-minus"
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="qty-sm-display">{item.quantity}</span>
                        <button
                          className="qty-btn-sm-plus"
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Continue Shopping Link */}
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-600 transition py-2"
            >
              <MdArrowBack /> Continue Shopping
            </Link>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl sticky top-24 space-y-5">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <MdShoppingBag className="text-emerald-600" /> Order Summary
              </h2>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Subtotal ({totalCount} items)</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    ৳{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <MdLocalShipping className="w-4 h-4" /> Delivery Charge
                  </span>
                  <span className="font-bold text-emerald-600">
                    Calculated at checkout
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-4 border-t border-slate-200 dark:border-slate-800">
                <span>Subtotal</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  ৳{subtotal.toFixed(2)}
                </span>
              </div>

              {/* Delivery note */}
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <MdLocalShipping className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold leading-relaxed">
                  Delivery: <strong>৳60</strong> inside Dhaka / <strong>৳120</strong> outside Dhaka.
                  Cash on Delivery available.
                </p>
              </div>

              {/* Checkout Button */}
              <Button
                size="lg"
                onClick={handleCheckoutClick}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/20"
              >
                <span>Proceed to Checkout</span>
                <MdArrowForward className="w-5 h-5 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
