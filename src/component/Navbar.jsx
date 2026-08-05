"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  MdShoppingCart,
  MdSearch,
  MdFileUpload,
  MdPhoneInTalk,
  MdHome,
  MdCategory,
  MdReceiptLong,
  MdCheckCircle,
  MdClose,
} from "react-icons/md";
import {
  FaHandHoldingMedical,
  FaPrescriptionBottleAlt,
  FaStethoscope,
} from "react-icons/fa";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { totalCount } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Suggestion overlay states
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Prescription Upload Modal State
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [isUploadingPrescription, setIsUploadingPrescription] = useState(false);
  const [prescriptionSuccess, setPrescriptionSuccess] = useState(false);

  const drawerRef = useRef(null);
  const suggestionRef = useRef(null);

  // Load products list for client-side live search suggest
  useEffect(() => {
    async function loadSearchSuggestions() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const json = await res.json();
          const data = json.products || json.data || json || [];
          setAllProducts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.warn("Failed to load products for live suggestions:", err);
      }
    }
    loadSearchSuggestions();
  }, []);

  // Filter suggestions dynamically
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const query = searchTerm.toLowerCase();
    const filtered = allProducts.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(query)) ||
        (p.brand && p.brand.toLowerCase().includes(query)) ||
        (p.genericName && p.genericName.toLowerCase().includes(query)),
    );
    setSuggestions(filtered.slice(0, 5));
  }, [searchTerm, allProducts]);

  // Close live search overlay on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent background scroll when mobile drawer or modal is open
  useEffect(() => {
    if (isMobileDrawerOpen || isPrescriptionModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileDrawerOpen, isPrescriptionModalOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    router.push(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    setIsMobileDrawerOpen(false);
    setShowSuggestions(false);
  };

  const handlePrescriptionSubmit = (e) => {
    e.preventDefault();
    if (!prescriptionFile) return;
    setIsUploadingPrescription(true);
    setTimeout(() => {
      setIsUploadingPrescription(false);
      setPrescriptionSuccess(true);
      setTimeout(() => {
        setPrescriptionSuccess(false);
        setPrescriptionFile(null);
        setIsPrescriptionModalOpen(false);
      }, 2000);
    }, 1200);
  };

  const navLinks = [
    { name: "Home", href: "/", icon: MdHome },
    { name: "Categories", href: "/categories", icon: MdCategory },
    { name: "Track Order", href: "/track-order", icon: MdReceiptLong },
  ];

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md w-full top-0 sticky z-45 border-b border-emerald-100 shadow-sm transition-all">
        {/* ── Top Header Row ── */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 md:gap-4">
          {/* Brand Logo & Subtitle */}
          <Link
            href="/"
            className="flex items-center gap-2 md:gap-3 group shrink-0"
          >
            <div className="bg-linear-to-br from-emerald-600 to-teal-700 text-white w-10 h-10 md:w-11 md:h-11 rounded-2xl flex items-center justify-center font-black shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <FaHandHoldingMedical className="text-xl md:text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-base md:text-lg font-black text-emerald-950 tracking-tight leading-none group-hover:text-emerald-700 transition-colors">
                ফুজি মেডিকেল হল
              </h1>
              <p className="text-[9px] md:text-[11px] font-extrabold text-emerald-600 tracking-wide mt-1 leading-none">
                বিশ্বস্ত ঔষধ সেবায় ২৭ বছর
              </p>
            </div>
          </Link>

          {/* Desktop & Tablet Global Search Input */}
          <div
            className="hidden md:block flex-1 max-w-md mx-2 lg:mx-6 relative"
            ref={suggestionRef}
          >
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <button
                type="submit"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer flex items-center justify-center"
                title="Search button"
              >
                <MdSearch className="text-lg" />
              </button>
              <input
                type="text"
                placeholder="Search medicines, syrup, healthcare products..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full bg-slate-50 hover:bg-slate-100/70 border border-emerald-200/80 focus:border-emerald-500 rounded-full pl-10 pr-20 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-full transition-all shadow-sm cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* Desktop Autocomplete Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-emerald-100 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {suggestions.map((product) => {
                  const imageSrc =
                    product.image ||
                    `https://placehold.co/48x48/10b981/ffffff?text=${encodeURIComponent(product.name ? product.name.slice(0, 2) : "M")}`;
                  return (
                    <Link
                      key={product._id}
                      href={`/products/${product._id}`}
                      onClick={() => {
                        setShowSuggestions(false);
                        setSearchTerm("");
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50/50 transition-colors"
                    >
                      <img
                        src={imageSrc}
                        alt={product.name}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-150 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {product.name}
                        </p>
                        {product.genericName && (
                          <p className="text-[10px] text-emerald-600 truncate mt-0.5">
                            {product.genericName}
                          </p>
                        )}
                      </div>
                      <span className="text-xs font-black text-slate-900 shrink-0">
                        ৳{Number(product.price || 0).toFixed(2)}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Desktop Nav Links + Actions (Right) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                      isActive
                        ? "bg-emerald-100/80 text-emerald-900 shadow-xs"
                        : "text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Upload Prescription Button */}
            <button
              onClick={() => setIsPrescriptionModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 px-3 py-1.5 rounded-full text-xs font-extrabold shadow-xs transition-all cursor-pointer hover:shadow-sm"
              title="Upload Doctor's Prescription"
            >
              <MdFileUpload className="text-emerald-600 text-sm" />
              <span>Upload Prescription</span>
            </button>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 rounded-full hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-all group shrink-0"
              title="View Shopping Cart"
            >
              <MdShoppingCart className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform text-emerald-900" />
              {totalCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white font-black text-[10px] w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {totalCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Compact Mobile Search Bar */}
        <div className="block md:hidden bg-emerald-50/50 border-t border-emerald-100/60 px-3 py-2 relative">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <button
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer flex items-center justify-center"
            >
              <MdSearch className="text-base" />
            </button>
            <input
              type="text"
              placeholder="Search medicines, syrup, products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full bg-white border border-emerald-200/90 rounded-full pl-9 pr-16 py-1.5 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-xs"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs"
            >
              Search
            </button>
          </form>
        </div>
      </header>

      {/* Mobile Menu & Prescription Modal */}
      {isPrescriptionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-100 relative space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <FaStethoscope className="text-base" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">
                    Upload Prescription
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Order medicines directly with your doctor's slip
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPrescriptionModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>

            {prescriptionSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
                  <MdCheckCircle />
                </div>
                <h4 className="font-black text-slate-900 text-base">
                  Prescription Uploaded!
                </h4>
                <p className="text-xs text-slate-500">
                  Our registered pharmacist will review your slip and contact
                  you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePrescriptionSubmit} className="space-y-4">
                <div className="border-2 border-dashed border-emerald-200 hover:border-emerald-500 rounded-2xl p-6 text-center bg-emerald-50/40 hover:bg-emerald-50/80 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    required
                    onChange={(e) =>
                      setPrescriptionFile(e.target.files?.[0] || null)
                    }
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <MdFileUpload className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">
                    {prescriptionFile
                      ? prescriptionFile.name
                      : "Click or drag your Prescription image here"}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Supports JPG, PNG, PDF (Max 5MB)
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPrescriptionModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!prescriptionFile || isUploadingPrescription}
                    className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                  >
                    {isUploadingPrescription
                      ? "Uploading..."
                      : "Submit Prescription"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
