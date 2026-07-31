import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FiBox,
  FiGrid,
  FiHome,
  FiShield,
  FiLogOut,
  FiUserCheck,
  FiAlertTriangle,
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

  // Access Security Safeguard
  if (!user) {
    redirect("/login?redirectTo=/admin/products");
  }

  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <Link href="/admin/products" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <FiShield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-white tracking-wide text-lg">FujiMedical</h2>
                <span className="text-xs text-emerald-400 font-mono tracking-wider uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Admin Panel
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Management
            </div>

            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition group font-medium"
            >
              <FiBox className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 transition" />
              Products
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition group font-medium"
            >
              <FiClipboard className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 transition" />
              Orders
            </Link>

            <Link
              href="/admin/categories"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition group font-medium"
            >
              <FiGrid className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 transition" />
              Categories
            </Link>
          </nav>
        </div>

        {/* User Info & Storefront Link */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/40 rounded-xl border border-slate-800">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              {user.name ? user.name[0].toUpperCase() : "A"}
            </div>
            <div className="truncate text-xs">
              <p className="font-semibold text-slate-200 truncate">{user.name || "Admin User"}</p>
              <p className="text-slate-400 truncate">{user.email}</p>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition border border-slate-700/50"
          >
            <FiHome /> Return to Store Front
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto min-w-0">
        {children}
      </main>
    </div>
  );
}
