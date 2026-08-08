"use client";

import React, { useState, useEffect } from "react";
import {
  MdMedicalServices,
  MdShoppingCart,
  MdSearch,
  MdMic,
  MdClose,
  MdArrowForward,
  MdVerified,
  MdLocalShipping,
  MdSupportAgent,
  MdDeviceThermostat,
  MdAir,
  MdMedication,
  MdCleanHands,
  MdVisibility,
  MdMedicalInformation,
  MdBloodtype,
  MdChildCare,
  MdFemale,
  MdHome,
  MdReceiptLong,
  MdGridView,
  MdMail,
  MdMenu,
  MdBlock,
  MdFilterList,
} from "react-icons/md";
import {
  FaStore,
  FaFlask,
  FaStethoscope,
  FaCommentMedical,
  FaUserInjured,
  FaHeartbeat,
  FaHeart,
  FaPills,
  FaFileMedical,
  FaHandHoldingMedical,
  FaBrain,
} from "react-icons/fa";
import { Button } from "@heroui/react";
import Link from "next/link";
import { getProducts } from "@/app/actions/productActions";
import { getCategories } from "@/app/actions/categoryActions";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/component/ProductCard";
import HeroBanner from "@/component/HeroBanner";
import SpecialOfferCards from "@/component/SpecialOfferCards";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showSalesOnly, setShowSalesOnly] = useState(false);

  const { addToCart, setIsCartOpen } = useCart();

  // Dynamic state loaded from Firebase
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const salesCount = products.filter(
    (p) =>
      p.offerPrice &&
      Number(p.offerPrice) > 0 &&
      Number(p.offerPrice) < Number(p.price),
  ).length;

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.genericName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory ||
      (p.category &&
        p.category.toLowerCase() === selectedCategory.name?.toLowerCase());

    const matchesSales =
      !showSalesOnly ||
      (p.offerPrice &&
        Number(p.offerPrice) > 0 &&
        Number(p.offerPrice) < Number(p.price));

    return matchesSearch && matchesCategory && matchesSales;
  });

  // Load live data on mount
  useEffect(() => {
    async function loadLiveData() {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      if (prodRes.success) setProducts(prodRes.data);
      if (catRes.success) setCategories(catRes.data);
      setLoading(false);
    }
    loadLiveData();
  }, []);

  return (
    <div className="flex-1 flex flex-col pb-24 min-h-screen text-zinc-800 dark:text-zinc-100">
      <main className="max-w-container-max mx-auto w-full px-3 md:px-8">
        {/* Hero Carousel */}
        <HeroBanner />

        {/* Special Offer Cards */}
        <SpecialOfferCards />

        {/* Categories Section */}
        <section id="categories-section" className="py-6">
          <div className="flex justify-between items-center mb-3 font-sans">
            <div>
              <h3 className="text-black dark:text-white font-extrabold text-lg md:text-2xl">
                Categories
              </h3>
              <p className="text-[11px] md:text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                Browse medicines & equipment by category
              </p>
            </div>

            <button
              onClick={() => setIsFilterOpen(true)}
              className="md:hidden flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] shadow cursor-pointer active:scale-95"
            >
              <MdFilterList /> Filter
            </button>

            <Link
              href="/categories"
              className="hidden md:flex text-xs md:text-sm font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 px-2.5 py-1.5 rounded-lg hover:bg-emerald-50/50 dark:hover:bg-zinc-900/50 transition-all items-center gap-1"
            >
              <span>View All Categories</span>
              <MdArrowForward />
            </Link>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-6 bg-emerald-50/20 dark:bg-zinc-900 rounded-2xl border border-dashed border-emerald-200">
              <p className="text-xs text-zinc-500 font-medium">
                Loading categories...
              </p>
            </div>
          ) : (
            /* Desktop categories scroll bar */
            <div className="hidden md:flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setShowSalesOnly(false);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  !selectedCategory && !showSalesOnly
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-white dark:bg-zinc-900 border border-emerald-100 text-zinc-700 dark:text-zinc-300 hover:bg-emerald-50"
                }`}
              >
                All Products
              </button>

              {/* Virtual Sales filter button */}
              {salesCount > 0 && (
                <button
                  onClick={() => {
                    setShowSalesOnly(true);
                    setSelectedCategory(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    showSalesOnly
                      ? "bg-amber-500 text-white shadow-md"
                      : "bg-white dark:bg-zinc-900 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                  }`}
                >
                  🔖 Sales
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold ${
                      showSalesOnly
                        ? "bg-white/25 text-white"
                        : "bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300"
                    }`}
                  >
                    {salesCount}
                  </span>
                </button>
              )}

              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowSalesOnly(false);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    selectedCategory?._id === cat._id
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-emerald-50"
                  }`}
                >
                  <MdGridView />
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Mobile Filter Drawer / Modal */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              onClick={() => setIsFilterOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            />
            <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-zinc-950 shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-right duration-200">
              <div>
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
                  <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <MdFilterList className="text-emerald-600" /> Categories
                  </h3>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 cursor-pointer"
                  >
                    <MdClose className="text-lg" />
                  </button>
                </div>

                <div className="space-y-2 overflow-y-auto max-h-[70vh] pr-1">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setShowSalesOnly(false);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex justify-between items-center transition ${
                      !selectedCategory && !showSalesOnly
                        ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        : "bg-zinc-50 dark:bg-zinc-900 border border-transparent text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    <span>All Products</span>
                    <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-extrabold">
                      {products.length}
                    </span>
                  </button>

                  {/* Mobile Sales filter button */}
                  {salesCount > 0 && (
                    <button
                      onClick={() => {
                        setShowSalesOnly(true);
                        setSelectedCategory(null);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex justify-between items-center transition ${
                        showSalesOnly
                          ? "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                          : "bg-zinc-50 dark:bg-zinc-900 border border-transparent text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      <span>🔖 Sales</span>
                      <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-extrabold">
                        {salesCount}
                      </span>
                    </button>
                  )}

                  {categories.map((cat) => {
                    const count = products.filter(
                      (p) =>
                        p.category &&
                        p.category.toLowerCase() === cat.name.toLowerCase(),
                    ).length;
                    return (
                      <button
                        key={cat._id}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setShowSalesOnly(false);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex justify-between items-center transition ${
                          selectedCategory?._id === cat._id
                            ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            : "bg-zinc-50 dark:bg-zinc-900 border border-transparent text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-extrabold">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 rounded-xl shadow-lg shadow-emerald-600/20 text-xs mt-4 cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {/* Live Products Section */}
        <section
          id="products-section"
          className="py-4 border-t border-emerald-50 dark:border-zinc-900"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-black dark:text-white font-extrabold text-lg md:text-2xl capitalize">
                {showSalesOnly
                  ? "🔖 Sales"
                  : selectedCategory
                    ? `${selectedCategory.name} Products`
                    : "All Products"}
              </h3>
              <p className="text-[11px] md:text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                Showing {filteredProducts.length} products
                {showSalesOnly && " on sale"}
              </p>
            </div>
            {(selectedCategory || showSalesOnly) && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setShowSalesOnly(false);
                }}
                className="btn btn-ghost btn-xs text-emerald-700 hover:bg-emerald-50 font-bold cursor-pointer"
              >
                Clear Filter
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-20 text-center text-zinc-400 space-y-3">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-semibold">
                Loading live products from MongoDB...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-emerald-50/20 dark:bg-zinc-900 rounded-3xl border border-dashed border-emerald-200">
              <p className="font-bold text-zinc-600 dark:text-zinc-300 text-base">
                No products found in MongoDB
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Add products from the Admin Dashboard or adjust your search
                filter.
              </p>
            </div>
          ) : (
            /* Compact responsive grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
