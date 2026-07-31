"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  MdShoppingCart,
  MdLogout,
  MdKeyboardArrowDown,
  MdShoppingBag,
  MdPerson,
  MdVerified,
  MdMenu,
  MdClose,
  MdSearch,
  MdFileUpload,
  MdPhoneInTalk,
  MdHome,
  MdCategory,
  MdReceiptLong,
  MdAdminPanelSettings,
  MdCheckCircle,
} from "react-icons/md";
import { FaPrescriptionBottleAlt, FaStethoscope } from "react-icons/fa";
import { useSession, signOut } from "@/lib/auth-client";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { totalCount } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  const dropdownRef = useRef(null);
  const drawerRef = useRef(null);
  const suggestionRef = useRef(null);
  const mobileSuggestionRef = useRef(null);

  const { data: session, isPending } = useSession();
  const user = session?.user;

  // Load products list for client-side live search suggest
  useEffect(() => {
    async function loadSearchSuggestions() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const json = await res.json();
          // The API response might have products wrapped inside products object
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
        (p.genericName && p.genericName.toLowerCase().includes(query))
    );
    setSuggestions(filtered.slice(0, 5));
  }, [searchTerm, allProducts]);

  // Close dropdowns & live search overlays on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
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

  const handleSignOut = async () => {
    setIsDropdownOpen(false);
    setIsMobileDrawerOpen(false);
    await signOut();
    router.push("/");
  };

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
    { name: "My Orders", href: "/profile#orders", icon: MdReceiptLong },
  ];

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md w-full top-0 sticky z-45 border-b border-emerald-100 shadow-sm transition-all">
        {/* ── Top Header Row ── */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 md:gap-4">
          
          {/* Brand Logo & Subtitle */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white w-10 h-10 md:w-11 md:h-11 rounded-2xl flex items-center justify-center font-black shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <FaPrescriptionBottleAlt className="text-xl md:text-2xl text-white" />
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

          {/* Desktop & Tablet Global Search Input (Center - md & lg) */}
          <div className="hidden md:block flex-1 max-w-md mx-2 lg:mx-6 relative" ref={suggestionRef}>
            <form
              onSubmit={handleSearchSubmit}
              className="relative w-full"
            >
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

            {/* Desktop Autocomplete Suggestions Dropdown Overlay */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-emerald-100 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
                {suggestions.map((product) => {
                  const imageSrc = product.image || `https://placehold.co/48x48/10b981/ffffff?text=${encodeURIComponent(product.name ? product.name.slice(0,2) : "M")}`;
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
                        <p className="text-xs font-bold text-slate-800 truncate">{product.name}</p>
                        {product.genericName && (
                          <p className="text-[10px] text-emerald-600 truncate mt-0.5">{product.genericName}</p>
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
            
            {/* Desktop Horizontal Nav Links (lg:flex) */}
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

              {user?.role === "admin" && (
                <Link
                  href="/admin/products"
                  className="px-3 py-1.5 rounded-full text-xs font-black text-emerald-800 bg-emerald-100 hover:bg-emerald-200 transition-all border border-emerald-200"
                >
                  Admin Panel
                </Link>
              )}
            </nav>

            {/* Upload Prescription Button (Desktop & Tablet) */}
            <button
              onClick={() => setIsPrescriptionModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 px-3 py-1.5 rounded-full text-xs font-extrabold shadow-xs transition-all cursor-pointer hover:shadow-sm"
              title="Upload Doctor's Prescription"
            >
              <MdFileUpload className="text-emerald-600 text-sm" />
              <span>Upload Prescription</span>
            </button>

            {/* Cart Icon Trigger */}
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

            {/* Auth Buttons / Profile Dropdown (Desktop & Mobile) */}
            {isPending ? (
              <div className="w-8 h-8 rounded-full bg-emerald-100 animate-pulse" />
            ) : user ? (
              /* User Profile Dropdown Pill */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen((v) => !v)}
                  className="group flex items-center gap-1.5 p-1 pr-2.5 bg-white hover:bg-emerald-50/50 border border-emerald-200 rounded-full shadow-xs hover:shadow transition-all duration-200 focus:outline-none cursor-pointer"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User Profile"}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                      className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover shadow-xs"
                    />
                  ) : null}
                  <div
                    style={{ display: user.image ? "none" : "flex" }}
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black items-center justify-center text-xs md:text-sm uppercase shadow-xs shrink-0"
                  >
                    {(user.name
                      ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
                      : user.email?.[0] || "U"
                    )}
                  </div>
                  <span className="text-xs font-black text-slate-800 max-w-[90px] truncate hidden sm:inline-block">
                    {user.name?.split(" ")[0] || "Account"}
                  </span>
                  <MdKeyboardArrowDown
                    className={`text-emerald-600 text-base transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu Popup */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-64 bg-white rounded-2xl shadow-xl border border-emerald-100 py-1.5 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 bg-emerald-50/40 border-b border-emerald-100/60 flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <h4 className="text-xs font-black text-slate-900 truncate">
                            {user.name || "User Account"}
                          </h4>
                          <MdVerified className="text-emerald-500 text-xs shrink-0" />
                        </div>
                        <p className="text-[11px] font-semibold text-slate-500 truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="p-1.5 flex flex-col gap-0.5">
                      <Link
                        href="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-all"
                      >
                        <MdPerson className="text-emerald-600 text-base" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        href="/profile#orders"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-all"
                      >
                        <MdReceiptLong className="text-emerald-600 text-base" />
                        <span>My Orders</span>
                      </Link>

                      {user?.role === "admin" && (
                        <Link
                          href="/admin/products"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-100/60 hover:bg-emerald-200/80 rounded-xl transition-all border border-emerald-200"
                        >
                          <MdAdminPanelSettings className="text-emerald-600 text-base" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-emerald-100/60 my-1" />

                    <div className="p-1.5">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                      >
                        <MdLogout className="text-base text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Guest Login / Signup Buttons (Desktop) */
              <div className="hidden sm:flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="text-xs font-extrabold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 px-3.5 py-1.5 rounded-full transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-full shadow-sm shadow-emerald-600/20 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle Button (< lg) */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
              title="Open Navigation Menu"
            >
              <MdMenu className="w-6 h-6 text-emerald-900" />
            </button>
          </div>
        </div>

        {/* ── Compact Mobile Search Bar (Directly below header - < md) ── */}
        <div className="block md:hidden bg-emerald-50/50 border-t border-emerald-100/60 px-3 py-2 relative">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <button
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer flex items-center justify-center"
              title="Search button"
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

          {/* Mobile Autocomplete Suggestions Dropdown Overlay */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-3 right-3 mt-1.5 bg-white border border-emerald-100 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
              {suggestions.map((product) => {
                const imageSrc = product.image || `https://placehold.co/48x48/10b981/ffffff?text=${encodeURIComponent(product.name ? product.name.slice(0,2) : "M")}`;
                return (
                  <Link
                    key={product._id}
                    href={`/products/${product._id}`}
                    onClick={() => {
                      setShowSuggestions(false);
                      setSearchTerm("");
                    }}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-emerald-50/50 transition-colors"
                  >
                    <img
                      src={imageSrc}
                      alt={product.name}
                      className="w-7 h-7 rounded-lg object-cover border border-slate-150 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-slate-800 truncate">{product.name}</p>
                    </div>
                    <span className="text-[11px] font-black text-slate-900 shrink-0">
                      ৳{Number(product.price || 0).toFixed(2)}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* ========================================================= */}
      {/* ── MOBILE SLIDE-OVER DRAWER MENU ── */}
      {/* ========================================================= */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            ref={drawerRef}
            className="bg-white w-4/5 max-w-sm h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300 border-l border-emerald-100"
          >
            {/* Drawer Header */}
            <div>
              <div className="p-4 border-b border-emerald-100 flex items-center justify-between bg-emerald-50/50">
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-600 text-white w-8 h-8 rounded-xl flex items-center justify-center font-bold">
                    <FaPrescriptionBottleAlt className="text-base" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm leading-tight">
                      ফুজি মেডিকেল হল
                    </h3>
                    <p className="text-[9px] font-extrabold text-emerald-600 leading-none mt-0.5">
                      বিশ্বস্ত ঔষধ সেবায় ২৭ বছর
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-emerald-100/60 text-slate-500 hover:text-slate-800 transition cursor-pointer"
                >
                  <MdClose className="w-5 h-5" />
                </button>
              </div>

              {/* User State Header in Drawer */}
              <div className="p-4 bg-emerald-900 text-white space-y-3">
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-700 border-2 border-emerald-400 flex items-center justify-center font-black text-base uppercase shrink-0">
                      {user.name ? user.name[0] : user.email[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-sm text-white truncate">{user.name || "User"}</p>
                      <p className="text-xs text-emerald-200 truncate">{user.email}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-emerald-200">Welcome to Fuji Medical!</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/login"
                        onClick={() => setIsMobileDrawerOpen(false)}
                        className="py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-center text-xs font-bold rounded-xl shadow transition-all"
                      >
                        Login
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setIsMobileDrawerOpen(false)}
                        className="py-2 bg-white text-emerald-950 text-center text-xs font-bold rounded-xl shadow transition-all"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <div className="p-4 space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-2 mb-2">
                  Navigation
                </p>

                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileDrawerOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-xs transition-all ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className="text-base text-emerald-600" />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}

                {/* Upload Prescription Link in Drawer */}
                <button
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    setIsPrescriptionModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-xs bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm cursor-pointer mt-2"
                >
                  <MdFileUpload className="text-base" />
                  <span>Upload Doctor's Prescription</span>
                </button>

                {user?.role === "admin" && (
                  <Link
                    href="/admin/products"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-xs bg-emerald-100 text-emerald-900 hover:bg-emerald-200 transition border border-emerald-300 mt-2"
                  >
                    <MdAdminPanelSettings className="text-base text-emerald-700" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Emergency Hotline & Sign Out Footer */}
            <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50">
              <a
                href="tel:01700000000"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-black shadow-xs hover:bg-rose-100 transition"
              >
                <MdPhoneInTalk className="text-base text-rose-600 animate-bounce" />
                <span>Hotline: 01700-000000 (24/7)</span>
              </a>

              {user && (
                <button
                  onClick={handleSignOut}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-rose-200 text-rose-600 rounded-xl text-xs font-bold shadow-xs hover:bg-rose-50 transition cursor-pointer"
                >
                  <MdLogout className="text-base" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ── UPLOAD PRESCRIPTION MODAL ── */}
      {/* ========================================================= */}
      {isPrescriptionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-100 relative space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <FaStethoscope className="text-base" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">Upload Prescription</h3>
                  <p className="text-[11px] text-slate-500">Order medicines directly with your doctor's slip</p>
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
              <div className="py-8 text-center space-y-3 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
                  <MdCheckCircle />
                </div>
                <h4 className="font-black text-slate-900 text-base">Prescription Uploaded!</h4>
                <p className="text-xs text-slate-500">Our registered pharmacist will review your slip and contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handlePrescriptionSubmit} className="space-y-4">
                <div className="border-2 border-dashed border-emerald-200 hover:border-emerald-500 rounded-2xl p-6 text-center bg-emerald-50/40 hover:bg-emerald-50/80 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    required
                    onChange={(e) => setPrescriptionFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <MdFileUpload className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">
                    {prescriptionFile ? prescriptionFile.name : "Click or drag your Prescription image here"}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Supports JPG, PNG, PDF (Max 5MB)</p>
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
                    {isUploadingPrescription && (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {isUploadingPrescription ? "Uploading..." : "Submit Prescription"}
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
