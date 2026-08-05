"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiGrid,
  FiTruck,
  FiShoppingBag,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { useCart } from "@/context/CartContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { totalCount } = useCart();

  // ── Hydration guard ──────────────────────────────────────────────────────
  // The component renders null on the server (and during the initial client
  // paint) to guarantee server HTML === client HTML. After the first mount we
  // read cookies and decide what to show. This eliminates the hydration
  // mismatch that occurred when isAdmin differed between server and client.
  const [isMounted, setIsMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Mark as mounted FIRST — this unlocks the real render
    setIsMounted(true);

    const checkAdminSession = () => {
      if (typeof document === "undefined") return;
      const cookies = document.cookie.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        if (key) acc[key.trim()] = value;
        return acc;
      }, {});
      setIsAdmin(
        cookies.admin_token === "authenticated" ||
          cookies.admin_logged_in === "true"
      );
    };

    checkAdminSession();

    // Re-sync when the window regains focus (e.g. login/logout in another tab)
    window.addEventListener("focus", checkAdminSession);
    return () => window.removeEventListener("focus", checkAdminSession);
  }, [pathname]);

  // ── Route guard ──────────────────────────────────────────────────────────
  // Hide the public bottom bar entirely inside /admin/* — the admin layout
  // provides its own mobile header + drawer, so having both would stack them.
  if (pathname.startsWith("/admin")) return null;

  // ── Render null until mounted (prevents hydration mismatch) ─────────────
  if (!isMounted) return null;

  // ── Nav items ────────────────────────────────────────────────────────────
  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: FiHome,
      isActive: pathname === "/",
    },
    {
      label: "Categories",
      href: "/categories",
      icon: FiGrid,
      isActive:
        pathname === "/categories" || pathname.startsWith("/categories/"),
    },
    {
      label: "Track Order",
      href: "/track-order",
      icon: FiTruck,
      isActive: pathname === "/track-order",
    },
    {
      label: "Cart",
      href: "/cart",
      icon: FiShoppingBag,
      isActive: pathname === "/cart",
      badge: totalCount,
    },
    // 5th slot: Admin panel when cookie is present, Account/login for guests
    isAdmin
      ? {
          label: "Admin",
          href: "/admin",
          icon: FiShield,
          isActive: false, // pathname already starts /admin → nav hidden above
        }
      : {
          label: "Account",
          href: "/admin/login",
          icon: FiUser,
          isActive: pathname === "/admin/login",
        },
  ];

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="block md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/85 backdrop-blur-xl border-t border-slate-200/70 dark:border-slate-800/80 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] pb-safe"
    >
      <div className="flex items-stretch justify-around max-w-lg mx-auto h-16 px-1">
        {navItems.map(({ label, href, icon: Icon, isActive, badge }) => (
          <Link
            key={label}
            href={href}
            className="relative flex-1 flex flex-col items-center justify-center gap-0.5 py-1 select-none group"
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
          >
            {/* Active top-bar indicator */}
            <span
              className={`absolute top-0 left-1/2 -translate-x-1/2 h-[2.5px] rounded-full transition-all duration-300 ${
                isActive
                  ? "w-8 bg-emerald-500 opacity-100"
                  : "w-0 bg-emerald-500 opacity-0"
              }`}
            />

            {/* Icon + badge */}
            <div className="relative">
              <Icon
                className={`w-[22px] h-[22px] transition-all duration-300 ${
                  isActive
                    ? "text-emerald-500 dark:text-emerald-400 scale-110"
                    : "text-slate-400 dark:text-slate-500 group-active:scale-90"
                }`}
              />
              {badge !== undefined && badge > 0 && (
                <span className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-white text-[9px] font-black flex items-center justify-center border-[1.5px] border-white dark:border-slate-950 shadow-sm leading-none">
                  {badge > 99 ? "99+" : badge}
                </span>
              )}
            </div>

            {/* Label */}
            <span
              className={`text-[10px] font-bold tracking-tight leading-none transition-all duration-300 ${
                isActive
                  ? "text-emerald-500 dark:text-emerald-400"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
