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
  const [isAdmin, setIsAdmin] = useState(false);

  // Detect admin session from cookies
  useEffect(() => {
    const checkAdminSession = () => {
      if (typeof document === "undefined") return;

      const cookies = document.cookie.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        if (key) acc[key.trim()] = value;
        return acc;
      }, {});

      const hasAdmin =
        cookies.admin_token === "authenticated" ||
        cookies.admin_logged_in === "true";

      setIsAdmin(hasAdmin);
    };

    checkAdminSession();

    // Re-check when the tab regains focus (e.g. after login in another tab)
    window.addEventListener("focus", checkAdminSession);
    return () => {
      window.removeEventListener("focus", checkAdminSession);
    };
  }, [pathname]);

  /** 5 permanent nav tabs — 5th slot switches between Admin and Account */
  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: FiHome,
      // Active only on exact home route
      isActive: pathname === "/",
    },
    {
      label: "Categories",
      href: "/categories",
      icon: FiGrid,
      isActive: pathname === "/categories" || pathname.startsWith("/categories/"),
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
    // 5th slot: Admin panel when logged in, otherwise Account/Login
    isAdmin
      ? {
          label: "Admin",
          href: "/admin",
          icon: FiShield,
          isActive:
            pathname === "/admin" || pathname.startsWith("/admin"),
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
      className="
        block md:hidden
        fixed bottom-0 left-0 right-0 z-50
        bg-white/80 dark:bg-slate-950/85
        backdrop-blur-xl
        border-t border-slate-200/70 dark:border-slate-800/80
        shadow-[0_-4px_24px_rgba(0,0,0,0.06)]
        pb-safe
      "
    >
      <div className="flex items-stretch justify-around max-w-lg mx-auto h-16 px-1">
        {navItems.map((item) => {
          const { label, href, icon: Icon, isActive, badge } = item;

          return (
            <Link
              key={label}
              href={href}
              className="
                relative flex-1 flex flex-col items-center justify-center
                gap-0.5 py-1
                select-none tap-highlight-transparent
                group
              "
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
            >
              {/* ── Active tab top-bar indicator ── */}
              <span
                className={`
                  absolute top-0 left-1/2 -translate-x-1/2
                  h-[2.5px] rounded-full
                  transition-all duration-300
                  ${
                    isActive
                      ? "w-8 bg-emerald-500 opacity-100"
                      : "w-0 bg-emerald-500 opacity-0"
                  }
                `}
              />

              {/* ── Icon + Badge wrapper ── */}
              <div className="relative">
                <Icon
                  className={`
                    w-[22px] h-[22px]
                    transition-all duration-300
                    ${
                      isActive
                        ? "text-emerald-500 dark:text-emerald-400 scale-110"
                        : "text-slate-400 dark:text-slate-500 group-active:scale-90"
                    }
                  `}
                />

                {/* Cart count badge */}
                {badge !== undefined && badge > 0 && (
                  <span
                    className="
                      absolute -top-2 -right-2.5
                      min-w-[18px] h-[18px] px-1
                      rounded-full
                      bg-emerald-500 text-white
                      text-[9px] font-black
                      flex items-center justify-center
                      border-[1.5px] border-white dark:border-slate-950
                      shadow-sm
                      leading-none
                    "
                  >
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </div>

              {/* ── Tab label ── */}
              <span
                className={`
                  text-[10px] font-bold tracking-tight leading-none
                  transition-all duration-300
                  ${
                    isActive
                      ? "text-emerald-500 dark:text-emerald-400"
                      : "text-slate-400 dark:text-slate-500"
                  }
                `}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
