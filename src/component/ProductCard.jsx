"use client";

import React from "react";
import Link from "next/link";
import { MdMedication, MdBlock, MdShoppingCart } from "react-icons/md";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart, setIsCartOpen } = useCart();
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  const displayPrice =
    product.offerPrice && Number(product.offerPrice) > 0
      ? Number(product.offerPrice)
      : Number(product.price || 0);

  const hasOffer =
    product.offerPrice && Number(product.offerPrice) > 0 &&
    Number(product.offerPrice) < Number(product.price);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
      setIsCartOpen(true);
    }
  };

  return (
    <Link
      href={`/products/${product._id}`}
      className="group bg-white dark:bg-zinc-900 rounded-2xl border border-emerald-100/60 dark:border-zinc-800 overflow-hidden hover:shadow-lg hover:border-emerald-400/60 dark:hover:border-emerald-600/50 transition-all duration-200 flex flex-col"
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] bg-slate-50 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img
            className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
            src={product.image}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const fallback = e.currentTarget.parentElement?.querySelector(".fallback-icon");
              if (fallback) fallback.style.display = "flex";
            }}
          />
        ) : null}

        {/* Fallback */}
        <div
          className="fallback-icon absolute inset-0 items-center justify-center"
          style={{ display: !product.image ? "flex" : "none" }}
        >
          <MdMedication className="w-10 h-10 text-emerald-300/60" />
        </div>

        {/* Category Badge */}
        {product.category && (
          <span className="absolute top-2 right-2 bg-emerald-600/90 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow leading-tight uppercase tracking-wide">
            {product.category}
          </span>
        )}

        {/* Out of Stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
            <span className="bg-rose-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1">
              <MdBlock className="w-3 h-3" /> Out of Stock
            </span>
          </div>
        )}

        {/* Offer badge */}
        {hasOffer && !isOutOfStock && (
          <span className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-[9px] font-black px-2 py-0.5 rounded-md shadow leading-tight">
            SALE
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5 flex flex-col gap-1.5 flex-1">
        <h3 className="font-bold text-[12px] md:text-[13px] text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {product.name}
        </h3>

        {product.genericName && (
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold line-clamp-1">
            {product.genericName}
          </p>
        )}

        {/* Price + Add to cart */}
        <div className="flex items-center justify-between mt-auto pt-1.5 border-t border-slate-100 dark:border-zinc-800">
          <div className="flex items-baseline gap-1 min-w-0">
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
              ৳{displayPrice.toFixed(0)}
            </span>
            {hasOffer && (
              <span className="text-[10px] text-slate-400 line-through">
                ৳{Number(product.price).toFixed(0)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={isOutOfStock ? `${product.name} — Out of stock` : `Add ${product.name} to cart`}
            className={`shrink-0 px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold transition-all flex items-center gap-1 cursor-pointer ${
              isOutOfStock
                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95"
            }`}
          >
            <MdShoppingCart className="text-xs" />
            <span>{isOutOfStock ? "Out" : "Add"}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
