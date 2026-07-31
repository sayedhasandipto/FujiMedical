import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FiBox,
  FiGrid,
  FiHome,
  FiShield,
  FiClipboard,
} from "react-icons/fi";

export const metadata = {
  title: "Admin Dashboard | FujiMedical",
  description: "FujiMedical Product & Category Management Dashboard",
};

export default async function AdminLayout({ children }) {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  const user = session?.user;
  const isAdmin = user && user.role === "admin";

  if (!user) {
    redirect("/login?redirectTo=/admin/products");
  }

  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row">
      {/* ── Light Sidebar ── */}
      <aside className="w-full md:w-60 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col justify-between shrink-0 shadow-sm">
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow shadow-emerald-500/30">
              <FiShield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-black text-slate-900 text-sm leading-tight">FujiMedical</h2>
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">
                Admin Panel
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-3 space-y-0.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 pt-3 pb-1.5">
              Management
            </p>

            <Link
              href="/admin/products"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all font-semibold text-sm group"
            >
              <FiBox className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
              Products
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all font-semibold text-sm group"
            >
              <FiClipboard className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
              Orders
            </Link>

            <Link
              href="/admin/categories"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all font-semibold text-sm group"
            >
              <FiGrid className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
              Categories
            </Link>
          </nav>
        </div>

        {/* User Info & Storefront Link */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-2.5 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm shrink-0">
              {user.name ? user.name[0].toUpperCase() : "A"}
            </div>
            <div className="truncate text-xs min-w-0">
              <p className="font-bold text-slate-800 truncate">{user.name || "Admin User"}</p>
              <p className="text-slate-400 truncate">{user.email}</p>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm shadow-emerald-600/20"
          >
            <FiHome className="w-3.5 h-3.5" /> Return to Store
          </Link>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 p-5 md:p-8 overflow-y-auto min-w-0 bg-slate-50">
        {children}
      </main>
    </div>
  );
}
