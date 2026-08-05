"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiGrid, FiTruck, FiShoppingBag, FiFileText } from "react-icons/fi";
import { useCart } from "@/context/CartContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { totalCount } = useCart();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminSession = () => {
      if (typeof document === "undefined") return;

      const cookies = document.cookie.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        if (key) acc[key.trim()] = value;
        return acc;
      }, {});

      // Check for the presence of the admin_token cookie or the companion cookie
      const hasAdmin = 
        cookies.admin_token === "authenticated" || 
        cookies.admin_logged_in === "true";

      setIsAdmin(hasAdmin);
    };

    checkAdminSession();

    // Sync state when page changes focus (e.g. logging in/out in another tab)
    window.addEventListener("focus", checkAdminSession);
    return () => {
      window.removeEventListener("focus", checkAdminSession);
    };
  }, [pathname]);

  // Standard items for all users
  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: FiHome,
    },
    {
      label: "Categories",
      href: "/categories",
      icon: FiGrid,
    },
    {
      label: "Track Order",
      href: "/track-order",
      icon: FiTruck,
    },
    {
      label: "Cart",
      href: "/cart",
      icon: FiShoppingBag,
      badge: totalCount,
    },
  ];

  // Dynamically append the Admin tab as the 5th item if logged in
  if (isAdmin) {
    navItems.push({
      label: "Admin",
      href: "/admin",
      icon: FiFileText,
    });
  }

  return (
    <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] px-2 pb-safe">
      <div className="flex items-center justify-between max-w-lg mx-auto h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center h-full py-1 text-center relative select-none"
            >
              <div
                className={`flex items-center justify-center p-1 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "text-emerald-600 dark:text-emerald-400 scale-105"
                    : "text-slate-500 dark:text-slate-400 active:scale-95"
                }`}
              >
                <Icon className="w-5 h-5" />
                
                {/* Cart Quantity Badge */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute top-2.5 right-1/2 translate-x-4 bg-emerald-500 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white dark:border-slate-900 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              
              <span
                className={`text-[10px] font-black tracking-tight transition-colors duration-300 mt-0.5 ${
                  isActive
                    ? "text-emerald-600 dark:text-emerald-400 font-extrabold"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {item.label}
              </span>

              {/* Active Bar Indicator */}
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-600 dark:bg-emerald-400 transition-all duration-300" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
