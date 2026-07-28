"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import {
  MdShoppingCart,
  MdLogout,
  MdKeyboardArrowDown,
  MdShoppingBag,
  MdPerson,
  MdVerified,
} from "react-icons/md";
import { useSession, signOut } from "@/lib/auth-client";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data: session, isPending } = useSession();
  const user = session?.user;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsDropdownOpen(false);
    await signOut();
  };

  return (
    <header className="bg-emerald-50/90 backdrop-blur-md w-full top-0 sticky z-50 border-b border-emerald-100/80 flex items-center justify-between px-3 md:px-6 py-2.5 transition-colors">
      <Link href="/">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="bg-emerald-600 text-white w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
            <span className="text-lg md:text-xl font-black leading-none">
              F
            </span>
          </div>
          <div>
            <h1 className="text-sm md:text-xl font-black text-emerald-900 tracking-tight leading-none">
              ফুজি মেডিকেল হল
            </h1>
            <p className="text-[9px] md:text-xs font-bold text-emerald-600 tracking-wide mt-1.5">
              বিশ্বস্ত ঔষধ সেবায় ২৭ বছর
            </p>
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-2 md:gap-3">
        {isPending ? (
          <div className="w-24 h-9 rounded-full bg-emerald-200/50 animate-pulse" />
        ) : user ? (
          /* Soft Clean User Profile Trigger */
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen((v) => !v)}
              className="group flex items-center gap-2 py-1 px-1.5 pr-2.5 bg-white hover:bg-emerald-50/50 border border-emerald-200/60 rounded-full shadow-sm hover:shadow transition-all duration-200 focus:outline-none cursor-pointer"
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover shadow-sm"
                />
              ) : (
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black flex items-center justify-center text-xs md:text-sm shadow-sm uppercase">
                  {user.name?.[0] || user.email?.[0] || "U"}
                </div>
              )}
              <span className="text-xs font-extrabold text-emerald-950 max-w-[100px] truncate hidden sm:inline-block">
                {user.name?.split(" ")[0] || "Account"}
              </span>
              <MdKeyboardArrowDown
                className={`text-emerald-600 text-base transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Clean Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-64 bg-white rounded-2xl shadow-xl border border-emerald-100/90 py-1.5 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Header User Profile Info */}
                <div className="px-4 py-3 bg-emerald-50/40 border-b border-emerald-100/60 flex items-center gap-3">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="w-10 h-10 rounded-full object-cover border border-emerald-300 shrink-0 shadow-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold flex items-center justify-center text-base shrink-0 uppercase shadow-sm">
                      {user.name?.[0] || user.email?.[0] || "U"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <h4 className="text-xs font-black text-slate-900 truncate leading-snug">
                        {user.name || "User"}
                      </h4>
                      <MdVerified className="text-emerald-500 text-xs shrink-0" title="Verified Account" />
                    </div>
                    <p className="text-[11px] font-semibold text-slate-500 truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Quick Menu Options */}
                <div className="p-1.5 flex flex-col gap-0.5">
                  <Link
                    href="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-all"
                  >
                    <MdPerson className="text-emerald-600 text-base" />
                    <span>My Profile</span>
                  </Link>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setCartCount((c) => c + 1);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <MdShoppingBag className="text-emerald-600 text-base" />
                      <span>My Cart Items</span>
                    </div>
                    {cartCount > 0 && (
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </div>

                <div className="border-t border-emerald-100/60 my-1" />

                {/* Sign Out Button */}
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
          /* Logged Out Buttons */
          <>
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button variant="ghost">Sign Up</Button>
            </Link>
          </>
        )}

        {/* Cart Button */}
        <button
          onClick={() => setCartCount(cartCount + 1)}
          className="btn btn-ghost btn-circle btn-sm relative hover:bg-emerald-100/50 group transition-all duration-300 text-emerald-800"
        >
          <div className="indicator">
            <MdShoppingCart
              size={20}
              className="md:w-[24px] md:h-[24px] group-hover:scale-110 transition-transform"
            />
            {cartCount > 0 && (
              <span className="badge badge-sm badge-error indicator-item font-bold text-white scale-90">
                {cartCount}
              </span>
            )}
          </div>
        </button>
      </div>
    </header>
  );
}
