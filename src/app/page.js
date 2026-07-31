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
                className="absolute inset-y-0 right-12 flex items-center pr-3 text-zinc-400 hover:text-emerald-600"
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
                    className="mt-1 md:mt-2.5 bg-white text-emerald-800 hover:bg-emerald-50 hover:scale-[1.02] active:scale-[0.98] px-3.5 py-1.5 md:px-5 md:py-2 rounded-xl font-bold text-[10px] md:text-xs transition-all duration-300 flex items-center gap-1.5"
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
                className={`h-1.5 rounded-full transition-all duration-300 ${
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
              <h3 className="text-black dark:text-white font-extrabold text-xl md:text-2xl">
                Categories
              </h3>
              <p className="text-[11px] md:text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                Browse medicines & equipment by category
              </p>
            </div>
            <Link
              href="/categories"
              className="text-xs md:text-sm font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 px-2.5 py-1.5 rounded-lg hover:bg-emerald-50/50 dark:hover:bg-zinc-900/50 transition-all flex items-center gap-1"
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
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
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
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
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

        {/* Live Products Section */}
        <section id="products-section" className="py-4 border-t border-emerald-50 dark:border-zinc-900">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-black dark:text-white font-extrabold text-xl md:text-2xl">
                {selectedCategory ? `${selectedCategory.name} Products` : "All Products"}
              </h3>
              <p className="text-[11px] md:text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                Showing live medicines & inventory from MongoDB ({filteredProducts.length} items)
              </p>
            </div>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="btn btn-ghost btn-xs text-emerald-700 hover:bg-emerald-50 font-bold"
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {filteredProducts.map((product) => {
                const isOutOfStock = product.stock !== undefined && product.stock <= 0;
                return (
                  <div
                    key={product._id}
                    className="p-3.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-2xl border border-emerald-100/60 dark:border-zinc-800 flex flex-col justify-between hover:border-emerald-500 hover:shadow-lg transition-all duration-300 group hover:-translate-y-0.5"
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
                          <MdMedication className="w-12 h-12 text-emerald-600/40" />
                        )}

                        {isOutOfStock ? (
                          <span className="absolute top-1.5 right-1.5 bg-rose-600 text-white text-[8px] md:text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow flex items-center gap-1">
                            <MdBlock className="w-2.5 h-2.5" /> Out of Stock
                          </span>
                        ) : product.category ? (
                          <span className="absolute top-1.5 right-1.5 bg-emerald-600 text-white text-[8px] md:text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow">
                            {product.category}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-1 space-y-0.5">
                        <p className="font-bold text-xs md:text-sm text-zinc-900 dark:text-zinc-100 leading-tight truncate group-hover:text-emerald-600 transition">
                          {product.name}
                        </p>
                        {product.genericName && (
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                            {product.genericName}
                          </p>
                        )}
                        {product.brand && (
                          <p className="text-[9px] text-zinc-400 dark:text-zinc-500 truncate">
                            Brand: {product.brand}
                          </p>
                        )}
                      </div>
                    </Link>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <div>
                        {product.unit && (
                          <span className="text-[8px] md:text-[9px] text-zinc-400 block font-medium">
                            {product.unit}
                          </span>
                        )}
                        <span className="text-xs md:text-sm font-black text-emerald-600 dark:text-emerald-400">
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
                        className={`text-[10px] md:text-xs font-extrabold px-3 py-1.5 rounded-xl transition-all shadow-sm ${
                          isOutOfStock
                            ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-300 dark:border-slate-700"
                            : "bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white"
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
        </section>
      </main>

      {/* Book Lab Test Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-md w-full p-5 md:p-6 shadow-xl border border-emerald-100/30 dark:border-zinc-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg md:text-xl text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                <FaFlask className="text-emerald-600" />
                Book a Home Lab Test
              </h3>
              <button
                onClick={() => setIsBookModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                <MdClose size={20} />
              </button>
            </div>
            <form onSubmit={handleBookSubmit} className="space-y-3.5">
              <div>
                <label className="label text-xs font-bold text-zinc-500 py-1">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  className="input input-bordered w-full rounded-xl bg-zinc-50 dark:bg-zinc-800 border-emerald-100 dark:border-zinc-700 h-10 text-sm"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="label text-xs font-bold text-zinc-500 py-1">
                  Phone Number
                </label>
                <input
                  required
                  type="tel"
                  className="input input-bordered w-full rounded-xl bg-zinc-50 dark:bg-zinc-800 border-emerald-100 dark:border-zinc-700 h-10 text-sm"
                  placeholder="Enter phone number"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl mt-3.5 py-2.5 transition-all text-sm"
              >
                Confirm Booking Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-2 py-1.5 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-t border-emerald-100/30 dark:border-zinc-900 z-50 rounded-t-2xl">
        {[
          { name: "home", label: "Home", icon: <MdHome size={22} /> },
          { name: "categories", label: "Categories", icon: <MdGridView size={22} /> },
          { name: "orders", label: "Orders", icon: <MdReceiptLong size={22} /> },
          { name: "inbox", label: "Inbox", icon: <MdMail size={22} /> },
          { name: "more", label: "More", icon: <MdMenu size={22} /> },
        ].map((tab) => (
          <button
            key={tab.name}
            onClick={() => {
              setActiveTab(tab.name);
              if (tab.name === "home") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else if (tab.name === "categories") {
                window.location.href = "/categories";
              }
            }}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all duration-300 min-w-[56px] ${
              activeTab === tab.name
                ? "bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-350 scale-105 font-bold"
                : "text-emerald-800/80 dark:text-emerald-400/80 hover:text-emerald-900 hover:bg-emerald-50/50"
            }`}
          >
            {tab.icon}
            <span className="font-label-md text-[9px] font-semibold mt-0.5">
              {tab.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
