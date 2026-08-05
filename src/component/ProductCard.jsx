"use client";

import React from "react";
import Link from "next/link";
import { MdMedication, MdBlock, MdShoppingCart, MdReceipt } from "react-icons/md";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart, setIsCartOpen } = useCart();
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
      setIsCartOpen(true);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-emerald-100/50 dark:border-zinc-800/80 p-4 flex flex-col justify-between hover:shadow-xl hover:border-emerald-500/80 dark:hover:border-emerald-600 transition-all duration-300 group relative">
      <Link href={`/products/${product._id}`} className="flex flex-col gap-3">
        {/* Product Image Container */}
        <div className="relative aspect-square w-full rounded-2xl bg-slate-50 dark:bg-zinc-800/40 flex items-center justify-center overflow-hidden border border-emerald-50/20">
          {product.image ? (
            <img
              className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
              src={product.image}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fallback = e.currentTarget.parentElement?.querySelector(".fallback-icon");
                if (fallback) fallback.style.display = "block";
              }}
            />
          ) : null}

          {/* Fallback Icon */}
          <div
            className="fallback-icon hidden"
            style={{ display: !product.image ? "block" : "none" }}
          >
            <MdMedication className="w-12 h-12 text-emerald-600/30" />
          </div>

          {/* Rx / Prescription Badges */}
          {product.prescriptionRequired && (
            <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[9px] font-black px-2.5 py-1 rounded-lg shadow-sm">
              Rx Required
            </span>
          )}

          {/* Stock Status Badges */}
          {isOutOfStock ? (
            <span className="absolute top-2.5 right-2.5 bg-rose-600 text-white text-[9px] font-black px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
              <MdBlock className="w-3 h-3" /> Out of Stock
            </span>
          ) : product.category ? (
            <span className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[9px] font-black px-2.5 py-1 rounded-lg shadow-sm">
              {product.category}
            </span>
          ) : null}
        </div>

        {/* Text Metadata */}
        <div className="space-y-1.5 min-h-[90px] flex flex-col justify-start">
          <h4 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {product.name}
          </h4>
          
          {product.genericName && (
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 line-clamp-1">
              {product.genericName}
            </p>
          )}
          
          {product.brand && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
              {product.brand}
            </p>
          )}
        </div>
      </Link>

      {/* Pricing & Add to Cart Action */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-zinc-800 gap-2">
        <div className="min-w-0">
          {product.unit && (
            <span className="text-[10px] text-slate-400 block font-medium truncate">
              {product.unit}
            </span>
          )}
          <span className="text-base md:text-lg font-black text-emerald-600 dark:text-emerald-400 block truncate">
            ৳{Number(product.price || 0).toFixed(0)}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ${
            isOutOfStock
              ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700"
              : "bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95"
          }`}
        >
          <MdShoppingCart className="text-sm" />
          <span>{isOutOfStock ? "Out" : "Add"}</span>
        </button>
      </div>
    </div>
  );
}
