"use client";

import React from "react";
import {
  FiEdit2,
  FiTrash2,
  FiImage,
  FiTag,
  FiPackage,
  FiAlertTriangle,
} from "react-icons/fi";
import { MdMedication } from "react-icons/md";

/**
 * ProductList
 * -----------
 * Purely presentational component for Admin > Products.
 *
 * Props:
 *   - products   {Array}    Filtered list of product objects
 *   - onEdit     {Function} Called with product when Edit is clicked
 *   - onDelete   {Function} Called with product when Delete is clicked
 */
export default function ProductList({ products, onEdit, onDelete }) {
  return (
    <div className="space-y-4">
      {/* ─────────────────────────────────────────────────── */}
      {/* MOBILE VIEW: Stacked cards — hidden on md+ screens */}
      {/* ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 md:hidden">
        {products.map((product) => {
          const hasOffer =
            product.offerPrice !== null &&
            product.offerPrice !== undefined &&
            Number(product.offerPrice) > 0;

          const isOutOfStock =
            product.stock !== undefined && product.stock <= 0;
          const isLowStock =
            !isOutOfStock && product.stock !== undefined && product.stock <= 10;
          const isInStock = !isOutOfStock && !isLowStock;

          return (
            <article
              key={product._id}
              className="
                p-4 bg-slate-900 border border-slate-800 rounded-2xl
                flex flex-col gap-3
                shadow-lg shadow-slate-950/40
                hover:border-slate-700 transition-colors duration-200
              "
            >
              {/* ── Top Row: Image + Meta ── */}
              <div className="flex gap-4 items-start">
                {/* Product Image */}
                <div className="shrink-0 w-[72px] h-[72px] rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const fb =
                          e.currentTarget.parentElement?.querySelector(
                            ".img-fallback"
                          );
                        if (fb) fb.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="img-fallback w-full h-full items-center justify-center text-slate-600"
                    style={{ display: product.image ? "none" : "flex" }}
                  >
                    <MdMedication className="w-8 h-8" />
                  </div>
                </div>

                {/* Text Info */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-white leading-snug line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Category Pill */}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-emerald-400 border border-slate-700">
                    <FiTag className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate max-w-[120px]">
                      {product.category || "Uncategorized"}
                    </span>
                  </span>

                  {/* Status Badge */}
                  {isOutOfStock ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/20">
                      <FiPackage className="w-2.5 h-2.5 shrink-0" /> Out of Stock
                    </span>
                  ) : isLowStock ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20">
                      <FiAlertTriangle className="w-2.5 h-2.5 shrink-0" /> Low:{" "}
                      {product.stock} left
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                      <FiPackage className="w-2.5 h-2.5 shrink-0" /> In Stock
                    </span>
                  )}
                </div>
              </div>

              {/* ── Price Row ── */}
              <div className="flex items-center justify-between border-t border-slate-800/80 pt-2.5">
                <div>
                  <p className="text-[10px] text-slate-500 font-medium mb-0.5 uppercase tracking-wide">
                    Price
                  </p>
                  {hasOffer ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-extrabold text-emerald-400 leading-none">
                        ৳{Number(product.offerPrice).toFixed(0)}
                      </span>
                      <span className="text-[9px] uppercase font-black bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">
                        Sale
                      </span>
                      <span className="text-slate-500 text-sm line-through">
                        ৳{Number(product.price).toFixed(0)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xl font-extrabold text-white leading-none">
                      ৳{Number(product.price).toFixed(0)}
                    </span>
                  )}
                </div>

                {/* Stock count (right side) */}
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-medium mb-0.5 uppercase tracking-wide">
                    Stock
                  </p>
                  {isOutOfStock ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      0 units
                    </span>
                  ) : (
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                        isLowStock
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}
                    >
                      {product.stock} units
                    </span>
                  )}
                </div>
              </div>

              {/* ── Action Buttons ── */}
              <div className="flex items-center gap-2 border-t border-slate-800/80 pt-3">
                <button
                  onClick={() => onEdit(product)}
                  className="
                    flex-1 flex items-center justify-center gap-2
                    h-11 rounded-xl
                    bg-slate-800 hover:bg-slate-700
                    text-slate-300 hover:text-emerald-400
                    font-semibold text-sm
                    border border-slate-700/50 hover:border-emerald-500/30
                    transition-all duration-200 active:scale-95
                  "
                  title="Edit Product"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(product)}
                  className="
                    flex-1 flex items-center justify-center gap-2
                    h-11 rounded-xl
                    bg-slate-800 hover:bg-rose-500/15
                    text-slate-300 hover:text-rose-400
                    font-semibold text-sm
                    border border-slate-700/50 hover:border-rose-500/30
                    transition-all duration-200 active:scale-95
                  "
                  title="Delete Product"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* ──────────────────────────────────────────────────── */}
      {/* DESKTOP VIEW: Full table — hidden below md breakpoint */}
      {/* ──────────────────────────────────────────────────── */}
      <div className="hidden md:block bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/60 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-4 px-6 font-semibold">Product Info</th>
                <th className="py-4 px-6 font-semibold">Category</th>
                <th className="py-4 px-6 font-semibold">Price / Offer</th>
                <th className="py-4 px-6 font-semibold">Stock</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {products.map((product) => {
                const hasOffer =
                  product.offerPrice !== null &&
                  product.offerPrice !== undefined &&
                  Number(product.offerPrice) > 0;

                return (
                  <tr
                    key={product._id}
                    className="hover:bg-slate-800/40 transition-colors duration-150"
                  >
                    {/* Product info cell */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-700/60 bg-slate-950 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-500 shrink-0">
                            <FiImage className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-white text-sm leading-snug line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-400 max-w-xs truncate mt-0.5">
                            {product.description || "No description provided"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category cell */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-emerald-400 border border-slate-700">
                        <FiTag className="w-3 h-3" />
                        {product.category || "Uncategorized"}
                      </span>
                    </td>

                    {/* Price cell */}
                    <td className="py-4 px-6">
                      {hasOffer ? (
                        <div className="space-y-0.5">
                          <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                            ৳{Number(product.offerPrice).toFixed(0)}
                            <span className="text-[9px] uppercase font-black bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">
                              Sale
                            </span>
                          </div>
                          <div className="text-slate-500 text-xs line-through">
                            ৳{Number(product.price).toFixed(0)}
                          </div>
                        </div>
                      ) : (
                        <div className="text-white font-bold text-sm">
                          ৳{Number(product.price).toFixed(0)}
                        </div>
                      )}
                    </td>

                    {/* Stock cell */}
                    <td className="py-4 px-6">
                      {product.stock > 10 ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {product.stock} in stock
                        </span>
                      ) : product.stock > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Low: {product.stock} left
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          Out of stock
                        </span>
                      )}
                    </td>

                    {/* Actions cell */}
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors duration-150"
                        title="Edit Product"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors duration-150"
                        title="Delete Product"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
