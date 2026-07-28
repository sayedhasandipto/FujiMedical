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

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [activeService, setActiveService] = useState("Store");
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  // Auto-play carousel slides every 5 seconds (5000ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  const categories = [
    {
      id: "cardiac",
      name: "Cardiac",
      bnName: "হৃদরোগ",
      icon: (
        <FaHeartbeat className="w-5 h-5 md:w-8 md:h-8 text-emerald-600 dark:text-emerald-400 group-hover:text-white" />
      ),
    },
    {
      id: "arthropathy",
      name: "Arthropathy",
      bnName: "বাতের ব্যথা",
      icon: (
        <FaUserInjured className="w-5 h-5 md:w-8 md:h-8 text-emerald-600 dark:text-emerald-400 group-hover:text-white" />
      ),
    },
    {
      id: "neurocare",
      name: "Neurocare",
      bnName: "স্নায়ু যত্ন",
      icon: (
        <FaBrain className="w-5 h-5 md:w-8 md:h-8 text-emerald-600 dark:text-emerald-400 group-hover:text-white" />
      ),
    },
    {
      id: "cold-flu",
      name: "Cold & Flu",
      bnName: "ঠান্ডা ও ফ্লু",
      icon: (
        <MdDeviceThermostat className="w-5 h-5 md:w-8 md:h-8 text-emerald-600 dark:text-emerald-400 group-hover:text-white" />
      ),
    },
    {
      id: "pharmacist-care",
      name: "Pharmacist Care",
      bnName: "ফার্মাসিস্ট সেবা",
      icon: (
        <FaHandHoldingMedical className="w-5 h-5 md:w-8 md:h-8 text-emerald-600 dark:text-emerald-400 group-hover:text-white" />
      ),
    },
  ];

  const products = [
    {
      id: "card-1",
      name: "Atova 10",
      generic: "Atorvastatin 10mg",
      company: "Beximco Pharmaceuticals",
      category: "cardiac",
      price: 60,
      unit: "10 Tablets (Strip)",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=80",
    },
    {
      id: "card-2",
      name: "Cardoc 6.25",
      generic: "Carvedilol 6.25mg",
      company: "Square Pharmaceuticals",
      category: "cardiac",
      price: 40,
      unit: "10 Tablets (Strip)",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=80",
    },
    {
      id: "arth-1",
      name: "Naproxen 500",
      generic: "Naproxen Sodium 500mg",
      company: "Incepta Pharmaceuticals",
      category: "arthropathy",
      price: 80,
      unit: "10 Tablets (Strip)",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=80",
    },
    {
      id: "arth-2",
      name: "Xeldrin 50",
      generic: "Diacerein 50mg",
      company: "Aristopharma",
      category: "arthropathy",
      price: 150,
      unit: "10 Capsules (Strip)",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=80",
    },
    {
      id: "neuro-1",
      name: "Revotril 0.5",
      generic: "Clonazepam 0.5mg",
      company: "Roche / Radiant",
      category: "neurocare",
      price: 70,
      unit: "10 Tablets (Strip)",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=80",
    },
    {
      id: "neuro-2",
      name: "Pregaba 75",
      generic: "Pregabalin 75mg",
      company: "Beximco Pharmaceuticals",
      category: "neurocare",
      price: 120,
      unit: "10 Capsules (Strip)",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=80",
    },
    {
      id: "cold-1",
      name: "Napa Extend",
      generic: "Paracetamol 665mg",
      company: "Beximco Pharmaceuticals",
      category: "cold-flu",
      price: 18,
      unit: "12 Tablets (Strip)",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=80",
    },
    {
      id: "cold-2",
      name: "Fexo 120",
      generic: "Fexofenadine 120mg",
      company: "Square Pharmaceuticals",
      category: "cold-flu",
      price: 80,
      unit: "10 Tablets (Strip)",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=80",
    },
    {
      id: "pharm-1",
      name: "Eco-Orsal Oral Saline",
      generic: "ORS Electrolyte",
      company: "SMC Enterprise",
      category: "pharmacist-care",
      price: 6,
      unit: "1 Sachet",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=80",
    },
    {
      id: "pharm-2",
      name: "Savlon Antiseptic 250ml",
      generic: "Chlorhexidine Gluconate",
      company: "ACI Limited",
      category: "pharmacist-care",
      price: 95,
      unit: "1 Bottle",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=80",
    },
  ];

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.bnName.includes(searchQuery),
  );

  const quickNav = [
    { name: "Store", icon: <FaStore className="w-5 h-5 md:w-6 md:h-6" /> },
    { name: "Lab", icon: <FaFlask className="w-5 h-5 md:w-6 md:h-6" /> },
    {
      name: "Doctor",
      icon: <FaStethoscope className="w-5 h-5 md:w-6 md:h-6" />,
    },
    {
      name: "Consult",
      icon: <FaCommentMedical className="w-5 h-5 md:w-6 md:h-6" />,
    },
  ];

  const handleBookSubmit = (e) => {
    e.preventDefault();
    setIsBookModalOpen(false);
    alert("Booking requested successfully! We will contact you shortly.");
  };

  return (
    <div className="flex-1 flex flex-col pb-24 min-h-screen text-zinc-800 dark:text-zinc-100">
      {/* Top App Bar */}
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
              placeholder="Search medicines, categories, or services..."
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
                {/* Decorative background gradients */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-black/10 rounded-full blur-2xl -ml-20 -mb-20"></div>

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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="w-full h-[90%] md:h-[95%] object-contain object-right-bottom transition-all duration-700"
                    alt={slide.title}
                    src={slide.image}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {carouselSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx
                  ? "w-5 bg-white"
                  : "w-1.5 bg-white/45 hover:bg-white/65"
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </section>
        {/* Categories Section */}
        <section id="categories-section" className="py-4">
          <div className="flex justify-between items-center mb-3 font-sans">
            <div>
              <h3 className="text-black font-extrabold text-xl md:text-2xl">
                All You Need
              </h3>
              <p className="text-[11px] md:text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                Browse medicines by categories
              </p>
            </div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs md:text-sm font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 px-2.5 py-1.5 rounded-lg hover:bg-emerald-50/50 dark:hover:bg-zinc-900/50 transition-all"
            >
              View All
            </button>
          </div>

          {filteredCategories.length === 0 ? (
            <div className="text-center py-12 bg-emerald-50/20 dark:bg-zinc-900 rounded-3xl border border-dashed border-emerald-250 dark:border-zinc-800">
              <p className="font-bold text-zinc-500 text-sm">
                No categories match your search
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="btn btn-link text-emerald-700 mt-2 btn-sm"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2 md:gap-4 max-w-3xl mx-auto">
              {filteredCategories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex flex-col items-center text-center gap-1 cursor-pointer group transition-all duration-300 ${selectedCategory?.id === cat.id ? "scale-105" : ""
                    }`}
                >
                  <div
                    className={`aspect-square w-full max-w-[70px] rounded-xl md:rounded-2xl p-1.5 md:p-3 flex items-center justify-center transition-all duration-300 border ${selectedCategory?.id === cat.id
                      ? "bg-emerald-600 border-emerald-600 text-white scale-105"
                      : "bg-white dark:bg-zinc-900 border-emerald-100/60 group-hover:bg-emerald-50 group-hover:border-emerald-600 group-hover:text-emerald-700 dark:border-zinc-800"
                      }`}
                  >
                    <div className="transition-all duration-300 group-hover:scale-110">
                      {cat.icon}
                    </div>
                  </div>
                  <div className="flex flex-col mt-0.5">
                    <span
                      className={`font-label-md text-[9px] sm:text-[11px] md:text-xs font-bold transition-colors duration-300 leading-tight ${selectedCategory?.id === cat.id
                        ? "text-emerald-700 dark:text-emerald-400 font-bold"
                        : "text-zinc-700 dark:text-zinc-300 group-hover:text-emerald-700"
                        }`}
                    >
                      {cat.name}
                    </span>
                    <span className="text-caption text-[8px] sm:text-[9px] md:text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                      ({cat.bnName})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        {/* Products Section */}
        <section
          id="products-section"
          className="py-6 border-t border-emerald-50 dark:border-zinc-900 mt-4"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-black font-extrabold text-xl md:text-2xl">
                {selectedCategory
                  ? `${selectedCategory.name} Products`
                  : "All Products"}
              </h3>
              <p className="text-[11px] md:text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                {selectedCategory
                  ? `Showing products in ${selectedCategory.name}`
                  : "Browse all available medicines"}
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {(selectedCategory
              ? products.filter((p) => p.category === selectedCategory.id)
              : products
            ).map((product) => (
              <div
                key={product.id}
                className="p-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-2xl border border-emerald-100/40 dark:border-zinc-800 flex flex-col justify-between hover:border-emerald-400 transition-all duration-300 group hover:-translate-y-0.5"
              >
                <div className="flex flex-col gap-1.5">
                  <div className="relative aspect-square w-full rounded-xl bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center overflow-hidden border border-emerald-50/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="w-[75%] h-[75%] object-contain transition-transform duration-300 group-hover:scale-105"
                      src={product.image}
                      alt={product.name}
                    />
                    <span className="absolute top-1.5 right-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[8px] md:text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {product.category}
                    </span>
                  </div>
                  <div className="mt-1">
                    <p className="font-bold text-xs md:text-sm text-zinc-800 dark:text-zinc-100 leading-tight truncate">
                      {product.name}
                    </p>
                    <p className="text-[9px] md:text-[10px] text-zinc-400 dark:text-zinc-500 font-medium truncate">
                      {product.generic}
                    </p>
                    <p className="text-[8px] text-zinc-400 dark:text-zinc-600 truncate">
                      {product.company}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <div>
                    <span className="text-[8px] md:text-[9px] text-zinc-400 block">
                      {product.unit}
                    </span>
                    <span className="text-xs md:text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                      ৳{product.price.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => setCartCount(cartCount + 1)}
                    className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-[10px] md:text-xs font-extrabold px-3.5 py-1.5 rounded-xl transition-all"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Book Lab Test Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-md w-full p-5 md:p-6 shadow-xl border border-emerald-100/30 dark:border-zinc-800 animate-scaleUp">
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
              <div>
                <label className="label text-xs font-bold text-zinc-500 py-1">
                  Select Test Package
                </label>
                <select className="select select-bordered w-full rounded-xl bg-zinc-50 dark:bg-zinc-800 border-emerald-100 dark:border-zinc-700 h-10 text-sm">
                  <option>Complete Blood Count (CBC)</option>
                  <option>Diabetes Screening (HbA1c)</option>
                  <option>Lipid Profile (Cholesterol)</option>
                  <option>Kidney / Liver Function Test</option>
                  <option>Full Body Checkup (Premium)</option>
                </select>
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
          {
            name: "orders",
            label: "Orders",
            icon: <MdReceiptLong size={22} />,
          },
          {
            name: "categories",
            label: "Categories",
            icon: <MdGridView size={22} />,
          },
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
                const element = document.getElementById("categories-section");
                element?.scrollIntoView({ behavior: "smooth" });
              } else if (tab.name === "orders") {
                const element = document.getElementById("products-section");
                element?.scrollIntoView({ behavior: "smooth" });
              } else if (tab.name === "inbox") {
                alert(
                  "ফুজি কাস্টমার কেয়ার লাইভ চ্যাট ওপেন হচ্ছে... কাস্টমার কেয়ার প্রতিনিধি ১ মিনিটের মধ্যে আপনার সাথে যুক্ত হবেন!",
                );
              } else if (tab.name === "more") {
                alert("প্রোফাইল সেটিংস এবং অন্যান্য অপশন শীঘ্রই আসছে!");
              }
            }}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all duration-300 min-w-[56px] ${activeTab === tab.name
              ? "bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-350 scale-105 font-bold"
              : "text-emerald-800/80 dark:text-emerald-400/80 hover:text-emerald-900 dark:hover:text-emerald-300 hover:bg-emerald-50/50 dark:hover:bg-zinc-900/50"
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
