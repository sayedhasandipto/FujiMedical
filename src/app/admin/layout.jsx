"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FiHome, FiShield, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import AdminSidebarNav from "@/component/AdminSidebarNav";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Automatically close mobile sidebar drawer on page transitions
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      // Clear the HTTP-only admin_token cookie via API
      await fetch("/api/admin/logout", { method: "POST" });
      // Redirect to login
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout error:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row relative">
      {/* Mobile Top Header Bar */}
      <header className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md">
            <FiShield className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="font-black text-white text-xs leading-none">
              FujiMedical
            </h2>
            <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">
              Admin Panel
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label="Open Sidebar"
        >
          <FiMenu className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* ── Dark Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 z-50 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:w-60 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand & Close Trigger */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <FiShield className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-black text-white text-sm leading-tight">
                  FujiMedical
                </h2>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                  Admin Panel
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Close Sidebar"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <AdminSidebarNav />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-2.5 px-3 py-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm shrink-0">
              A
            </div>
            <div className="truncate min-w-0">
              <p className="font-bold text-slate-200 text-xs truncate">Admin</p>
              <p className="text-slate-500 text-[11px] truncate">
                fujimedicalhall@gmail.com
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition border border-slate-700/50"
          >
            <FiHome className="w-3.5 h-3.5" /> Return to Store
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-red-900/30 hover:bg-red-900/60 text-red-400 hover:text-red-300 text-xs font-bold transition border border-red-900/50 cursor-pointer"
          >
            <FiLogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto min-w-0 bg-slate-950">
        {children}
      </main>
    </div>
  );
}
