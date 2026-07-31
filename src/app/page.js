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

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeService, setActiveService] = useState("Store");
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { addToCart, setIsCartOpen } = useCart();

  // Dynamic state loaded from MongoDB
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const carouselSlides = [
    {
      title: "Safe & Reliable Home Lab Tests",
      desc: "Sample collection at your doorstep. Reports in 24 hours.",
      bgClass: "slide-bg-1",
      btnText: "Book Now",
      action: () => setIsBookModalOpen(true),
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB8YeXq691WKPk6-VbeWUYdbIzMtMXHoQ3u5bOfy2z754uJlW2eQpHnqPMnwAGgZjDFiottu72OTdMLrEGhcKmihKxsENhWDBNQOYTWJ-w6vq45RkiBkk0Gj-pWvbAsoTcu1x3x85KlYvPa41sAL15CJb2V95lNyXdx45KJvydXLHMidOaev5ligu0ofyX1cG95RRBTvoTaJ5z2spaPgW6UUB8RtpQ5OmaAavvlhBJ257fOyepBn0QMSXdzsekmdKm0gdU9IPwzGGeQ",
    },
    {
      title: "Wholesale Medicines at Best Prices",
      desc: "Get genuine prescription drugs and OTC medicines in bulk.",
      bgClass: "slide-bg-2",
      btnText: "Browse Store",
      action: () => setActiveService("Store"),
      image:
        "https://images.unsplash.com/photo-1607619056574-7b8d304f3c6f?w=400&auto=format&fit=crop&q=80",
    },
    {
      title: "Instant Video Consultation",
      desc: "Connect with certified medical practitioners online within 10 minutes.",
      bgClass: "slide-bg-3",
      btnText: "Consult Now",
      action: () => setActiveService("Consult"),
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&auto=format&fit=crop&q=80",
    },
  ];

  // Load live MongoDB data on mount
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

  // Carousel timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.genericName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory ||
      (p.category && p.category.toLowerCase() === selectedCategory.name?.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const handleBookSubmit = (e) => {
    e.preventDefault();
    setIsBookModalOpen(false);
    alert("Booking requested successfully! We will contact you shortly.");
  };

  return (
    <div className="flex-1 flex flex-col pb-24 min-h-screen text-zinc-800 dark:text-zinc-100">
      <main className="max-w-container-max mx-auto w-full px-3 md:px-8">
        {/* Search Section */}
        <section className="py-3 md:py-6">
          <div className="relative group max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-emerald-600 dark:text-emerald-500">
              <MdSearch size={20} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-emerald-100/80 dark:border-zinc-800/80 rounded-2xl py-2.5 pl-12 pr-12 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 focus:outline-none transition-all text-zinc-850 dark:text-zinc-100 placeholder-zinc-400 font-body-md text-sm md:text-base"
              placeholder="Search medicines from MongoDB..."
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-12 flex items-center pr-3 text-zinc-400 hover:text-emerald-600 cursor-pointer"
              >
                <MdClose size={18} />
              </button>
            )}
            <div className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-emerald-600 hover:text-emerald-700 transition-colors">
              <MdMic size={20} />
            </div>
          </div>
        </section>

        {/* Hero Carousel Section */}
        <section className="relative overflow-hidden rounded-3xl h-44 md:h-72 group border border-emerald-100/40 dark:border-zinc-800/80">
          <div
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
              width: `${carouselSlides.length * 100}%`,
            }}
          >
            {carouselSlides.map((slide, idx) => (
              <div
                key={idx}
                className={`w-full h-full relative flex items-center p-6 md:p-12 overflow-hidden select-none flex-shrink-0 min-w-full ${slide.bgClass}`}
              >
                <div className="z-10 text-white max-w-[60%] md:max-w-[55%] flex flex-col items-start gap-1.5 md:gap-3">
                  <span className="bg-white/20 text-white text-[8px] md:text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider backdrop-blur-sm">
                    Featured Service
                  </span>
                  <h2 className="font-headline-lg text-sm md:text-3xl font-extrabold tracking-tight leading-tight text-white drop-shadow-sm">
                    {slide.title}
                  </h2>
                  <p className="font-body-md text-xs md:text-sm opacity-90 leading-relaxed max-w-md hidden sm:block">
                    {slide.desc}
                  </p>
                  <button
                    onClick={slide.action}
                    className="mt-1 md:mt-2.5 bg-white text-emerald-800 hover:bg-emerald-50 hover:scale-[1.02] active:scale-[0.98] px-3.5 py-1.5 md:px-5 md:py-2 rounded-xl font-bold text-[10px] md:text-xs transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{slide.btnText}</span>
                    <MdArrowForward size={12} className="md:w-3.5 md:h-3.5" />
                  </button>
                </div>
                <div className="absolute right-2 bottom-0 w-[42%] md:w-[48%] h-full flex items-end justify-end pointer-events-none">
                  <img
                    className="w-full h-[90%] md:h-[95%] object-contain object-right-bottom transition-all duration-700"
                    alt={slide.title}
                    src={slide.image}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {carouselSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === idx
                    ? "w-5 bg-white"
                    : "w-1.5 bg-white/45 hover:bg-white/65"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </section>

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
              <p className="text-xs text-zinc-500 font-medium">Loading categories...</p>
            </div>
          ) : (
            /* Desktop categories scroll bar */
            <div className="hidden md:flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  !selectedCategory
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-white dark:bg-zinc-900 border border-emerald-100 text-zinc-700 dark:text-zinc-300 hover:bg-emerald-50"
                }`}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat)}
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
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex justify-between items-center transition ${
                      !selectedCategory
                        ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        : "bg-zinc-50 dark:bg-zinc-900 border border-transparent text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    <span>All Products</span>
                    <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-extrabold">
                      {products.length}
                    </span>
                  </button>

                  {categories.map((cat) => {
                    const count = products.filter(
                      (p) => p.category && p.category.toLowerCase() === cat.name.toLowerCase()
                    ).length;
                    return (
                      <button
                        key={cat._id}
                        onClick={() => {
                          setSelectedCategory(cat);
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
        <section id="products-section" className="py-4 border-t border-emerald-50 dark:border-zinc-900">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-black dark:text-white font-extrabold text-lg md:text-2xl capitalize">
                {selectedCategory ? `${selectedCategory.name} Products` : "All Products"}
              </h3>
              <p className="text-[11px] md:text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                Showing live medicines & inventory from MongoDB ({filteredProducts.length} items)
              </p>
            </div>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="btn btn-ghost btn-xs text-emerald-700 hover:bg-emerald-50 font-bold cursor-pointer"
              >
                Clear Filter
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-20 text-center text-zinc-400 space-y-3">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-semibold">Loading live products from MongoDB...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-emerald-50/20 dark:bg-zinc-900 rounded-3xl border border-dashed border-emerald-200">
              <p className="font-bold text-zinc-600 dark:text-zinc-300 text-base">
                No products found in MongoDB
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Add products from the Admin Dashboard or adjust your search filter.
              </p>
            </div>
          ) : (
            /* Perfectly responsive 2 columns grid on small screens, scaling up to 5 on large screens */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {filteredProducts.map((product) => {
                const isOutOfStock = product.stock !== undefined && product.stock <= 0;
                return (
                  <div
                    key={product._id}
                    className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-emerald-100/60 dark:border-zinc-800 flex flex-col justify-between hover:border-emerald-500 hover:shadow-lg transition-all duration-300 group"
                  >
                    <Link href={`/products/${product._id}`} className="flex flex-col gap-2">
                      <div className="relative aspect-square w-full rounded-xl bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center overflow-hidden border border-emerald-50/30">
                        {product.image ? (
                          <img
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            src={product.image || `https://placehold.co/300x300/10b981/ffffff?text=${encodeURIComponent(product.name || "Medicine")}`}
                            alt={product.name}
                            onError={(e) => {
                              e.currentTarget.src = `https://placehold.co/300x300/10b981/ffffff?text=${encodeURIComponent(
                                product.name || "Medicine"
                              )}`;
                            }}
                          />
                        ) : (
                          <MdMedication className="w-10 h-10 text-emerald-600/40" />
                        )}

                        {isOutOfStock ? (
                          <span className="absolute top-1.5 right-1.5 bg-rose-600 text-white text-[8px] md:text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow flex items-center gap-1">
                            <MdBlock className="w-2.5 h-2.5" /> Out
                          </span>
                        ) : product.category ? (
                          <span className="absolute top-1.5 right-1.5 bg-emerald-600 text-white text-[8px] md:text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow">
                            {product.category}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-0.5 space-y-0.5">
                        <p className="font-extrabold text-xs md:text-sm text-zinc-900 dark:text-zinc-100 leading-tight truncate group-hover:text-emerald-600 transition">
                          {product.name}
                        </p>
                        {product.genericName && (
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold truncate leading-none">
                            {product.genericName}
                          </p>
                        )}
                        {product.brand && (
                          <p className="text-[9px] md:text-[10px] text-zinc-400 dark:text-zinc-500 truncate leading-none">
                            {product.brand}
                          </p>
                        )}
                      </div>
                    </Link>

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800 gap-1">
                      <div className="min-w-0">
                        {product.unit && (
                          <span className="text-[8px] md:text-[9px] text-zinc-400 block font-medium truncate">
                            {product.unit}
                          </span>
                        )}
                        <span className="text-xs md:text-sm font-black text-emerald-600 dark:text-emerald-400 block truncate">
                          ৳{Number(product.price || 0).toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          if (!isOutOfStock) {
                            addToCart(product, 1);
                            setIsCartOpen(true);
                          }
                        }}
                        disabled={isOutOfStock}
                        className={`text-[10px] md:text-xs font-extrabold px-2.5 py-1.5 rounded-xl transition-all shadow-sm shrink-0 cursor-pointer ${
                          isOutOfStock
                            ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-300 dark:border-slate-700"
                            : "bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white"
                        }`}
                      >
                        {isOutOfStock ? "Out" : "Add"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
