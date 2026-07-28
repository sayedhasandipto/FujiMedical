"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { MdShoppingCart } from "react-icons/md";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <header className="bg-emerald-50/60 dark:bg-emerald-950/60 backdrop-blur-md w-full top-0 sticky z-40 border-b border-emerald-100/40 dark:border-zinc-800/50 flex items-center justify-between px-3 md:px-6 py-2.5 transition-colors">
      <Link href="/">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="bg-emerald-600 dark:bg-emerald-500 text-white w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center font-bold">
            <span className="text-lg md:text-xl font-black leading-none">
              F
            </span>
          </div>
          <div>
            <h1 className="text-sm md:text-xl font-black text-emerald-800 dark:text-emerald-400 tracking-tight leading-none">
              ফুজি মেডিকেল হল
            </h1>
            <p className="text-[9px] md:text-xs font-bold text-emerald-600 dark:text-emerald-500 tracking-wide mt-1.5">
              বিশ্বস্ত ঔষধ সেবায় ২৭ বছর
            </p>
          </div>
        </div>
      </Link>
      <div className="flex items-center gap-1.5 md:gap-2">
        <Link href="/login">
          <Button>Login</Button>
        </Link>
        <Link href="/signup">
          <Button>Sign Up</Button>
        </Link>
        <button
          onClick={() => setCartCount(cartCount + 1)}
          className="btn btn-ghost btn-circle btn-sm relative hover:bg-emerald-50 dark:hover:bg-emerald-950/30 group transition-all duration-300 text-emerald-800 dark:text-emerald-400"
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
