"use client";

import React, { useState, useEffect } from "react";
import { getCategories } from "@/app/actions/categoryActions";
import { getProducts } from "@/app/actions/productActions";
import { useCart } from "@/context/CartContext";
import {
  MdGridView,
  MdSearch,
  MdShoppingCart,
  MdMedicalServices,
  MdBlock,
} from "react-icons/md";
import Link from "next/link";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const { addToCart, setIsCartOpen } = useCart();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [catRes, prodRes] = await Promise.all([
        getCategories(),
        getProducts(),
      ]);
      if (catRes.success) setCategories(catRes.data);
      if (prodRes.success) setProducts(prodRes.data);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchCat =
      selectedCategory === "all" ||
      (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());
    const matchSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.genericName?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-20">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-600 text-white py-12 px-4 shadow-md">
        <div className="max-w-6xl mx-auto text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold flex items-center justify-center gap-3">
            <MdGridView className="text-emerald-300" /> Browse Categories
          </h1>
          <p className="text-emerald-100 text-sm md:text-base max-w-xl mx-auto">
            Explore authentic medicines, surgical tools, and healthcare items organized by category directly from FujiMedical.
          </p>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto mt-4">
            <MdSearch className="absolute left-4 top-3 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products in categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-xl pl-11 pr-4 py-2.5 shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Category Pills / Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all shadow-sm ${
              selectedCategory === "all"
                ? "bg-emerald-600 text-white shadow-emerald-600/30"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800"
            }`}
          >
            All Categories ({products.length})
          </button>

          {categories.map((cat) => {
            const count = products.filter(
              (p) => p.category && p.category.toLowerCase() === cat.name.toLowerCase()
            ).length;
            return (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all shadow-sm flex items-center gap-2 ${
                  selectedCategory.toLowerCase() === cat.name.toLowerCase()
                    ? "bg-emerald-600 text-white shadow-emerald-600/30"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800"
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                    selectedCategory.toLowerCase() === cat.name.toLowerCase()
                      ? "bg-white/20 text-white"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 space-y-3">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Loading products from MongoDB...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-500">
            <MdMedicalServices className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
              No products found in this category
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Select another category or clear your search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((prod) => {
              const isOutOfStock = prod.stock !== undefined && prod.stock <= 0;
              return (
                <div
                  key={prod._id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:shadow-xl hover:border-emerald-400 transition-all group"
                >
                  <Link href={`/products/${prod._id}`} className="space-y-3 block">
                    <div className="aspect-square w-full rounded-xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center overflow-hidden relative">
                      {prod.image ? (
                        <img
                          src={prod.image || `https://placehold.co/300x300/10b981/ffffff?text=${encodeURIComponent(prod.name || "Medicine")}`}
                          alt={prod.name}
                          onError={(e) => {
                            e.currentTarget.src = `https://placehold.co/300x300/10b981/ffffff?text=${encodeURIComponent(
                              prod.name || "Medicine"
                            )}`;
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <MdMedicalServices className="w-12 h-12 text-slate-400" />
                      )}

                      {/* Stock badge or Category badge */}
                      {isOutOfStock ? (
                        <span className="absolute top-2 right-2 bg-rose-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                          <MdBlock className="w-3 h-3" /> Out of Stock
                        </span>
                      ) : prod.category ? (
                        <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                          {prod.category}
                        </span>
                      ) : null}
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base truncate group-hover:text-emerald-600 transition">
                        {prod.name}
                      </h3>
                      {prod.genericName && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                          {prod.genericName}
                        </p>
                      )}
                      {prod.brand && (
                        <p className="text-[11px] text-slate-400 truncate">
                          {prod.brand}
                        </p>
                      )}
                    </div>
                  </Link>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      {prod.unit && (
                        <span className="text-[10px] text-slate-400 block">
                          {prod.unit}
                        </span>
                      )}
                      <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                        ৳{Number(prod.price || 0).toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (!isOutOfStock) {
                          addToCart(prod, 1);
                          setIsCartOpen(true);
                        }
                      }}
                      disabled={isOutOfStock}
                      className={`font-bold px-3 py-1.5 rounded-xl text-xs shadow-md transition ${
                        isOutOfStock
                          ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-300 dark:border-slate-700"
                          : "bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white"
                      }`}
                    >
                      {isOutOfStock ? "Out of Stock" : "Add"}
                    </button>
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
