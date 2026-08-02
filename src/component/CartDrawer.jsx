"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import {
  MdClose,
  MdShoppingCart,
  MdAdd,
  MdRemove,
  MdDeleteOutline,
  MdArrowForward,
} from "react-icons/md";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const router = useRouter();

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

  const handleCheckoutClick = (e) => {
    e.preventDefault();
    setIsCartOpen(false);
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      {/* Slide-over Panel */}
      <aside className="fixed inset-y-0 right-0 max-w-full flex pl-10 h-full">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full overflow-hidden relative">


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
                <p className="text-[10px] text-slate-450 dark:text-slate-400 font-bold mt-0.5">
                  {totalCount} item{totalCount !== 1 ? "s" : ""} selected
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-650 transition cursor-pointer"
            >
              <MdClose className="w-6 h-6" />
            </button>
          </div>

          {/* Drawer Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-3.5">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <MdShoppingCart className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-700 dark:text-slate-300 text-sm">Your Cart is Empty</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-[200px] mx-auto leading-relaxed">
                    Add medicines or healthcare products to start shopping.
                  </p>
                </div>
              </div>
            ) : (
              cart.map((item) => {
                const itemPrice =
                  item.offerPrice !== null && item.offerPrice !== undefined
                    ? Number(item.offerPrice)
                    : Number(item.price);
                const imageSrc = item.image || `https://placehold.co/80x80/10b981/ffffff?text=${encodeURIComponent(item.name || "Item")}`;
                return (
                  <div
                    key={item._id}
                    className="flex items-center gap-3.5 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850"
                  >
                    <img
                      src={imageSrc}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/80x80/10b981/ffffff?text=${encodeURIComponent(item.name || "Item")}`;
                      }}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 truncate">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold mt-0.5">
                        ৳{itemPrice.toFixed(2)}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800 shrink-0">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-750 transition cursor-pointer"
                          >
                            <MdRemove className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 min-w-[24px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-750 transition cursor-pointer"
                          >
                            <MdAdd className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-slate-400 hover:text-red-500 transition cursor-pointer"
                        >
                          <MdDeleteOutline className="w-5 h-5" />
                        </button>
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

              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 text-center cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <MdArrowForward className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
