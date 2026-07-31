"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import {
  MdClose,
  MdShoppingCart,
  MdAdd,
  MdRemove,
  MdDeleteOutline,
  MdArrowForward,
} from "react-icons/md";
import Link from "next/link";

export default function CartDrawer() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalCount,
    isCartOpen,
    setIsCartOpen,
    isMounted,
  } = useCart();

  if (!isCartOpen || !isMounted) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      {/* Slide-over Panel */}
      <aside className="fixed inset-y-0 right-0 max-w-full flex pl-10 h-full">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full overflow-hidden">
          {/* Drawer Header (Fixed) */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-emerald-50/50 dark:bg-slate-900 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <MdShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Your Shopping Cart
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {totalCount} {totalCount === 1 ? "item" : "items"} selected
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Close cart"
            >
              <MdClose className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items List (Scrollable - Handles 20+ items seamlessly) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0 divide-y divide-slate-100 dark:divide-slate-800/60">
            {cart.length === 0 ? (
              <div className="py-20 text-center text-slate-400 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-slate-800 flex items-center justify-center mx-auto text-emerald-600">
                  <MdShoppingCart className="w-8 h-8" />
                </div>
                <p className="text-base font-bold text-slate-700 dark:text-slate-300">
                  Your cart is empty
                </p>
                <p className="text-xs text-slate-500">
                  Browse products and add medicines to your cart.
                </p>
              </div>
            ) : (
              cart.map((item) => {
                const priceToUse =
                  item.offerPrice !== null && item.offerPrice !== undefined
                    ? Number(item.offerPrice)
                    : Number(item.price);
                return (
                  <div
                    key={item._id}
                    className="flex gap-3 pt-4 first:pt-0"
                  >
                    <img
                      src={item.image || `https://placehold.co/100x100/10b981/ffffff?text=${encodeURIComponent(item.name || "Item")}`}
                      alt={item.name || "Item"}
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/100x100/10b981/ffffff?text=${encodeURIComponent(
                          item.name || "Item"
                        )}`;
                      }}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100"
                    />

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-slate-400 hover:text-red-500 p-0.5"
                            title="Remove item"
                          >
                            <MdDeleteOutline className="w-4 h-4" />
                          </button>
                        </div>
                        {item.unit && (
                          <p className="text-[10px] text-slate-400">{item.unit}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                          ৳{(priceToUse * item.quantity).toFixed(2)}
                        </span>

                        {/* Quantity Controls */}
                        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                          >
                            <MdRemove className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-slate-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                          >
                            <MdAdd className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer (Fixed at Bottom) */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900 space-y-4 shrink-0">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal ({totalCount} items)</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    ৳{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Charge</span>
                  <span className="font-bold text-emerald-600">Calculated at Checkout</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Total Amount</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    ৳{subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 text-center"
              >
                <span>Proceed to Checkout</span>
                <MdArrowForward className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
