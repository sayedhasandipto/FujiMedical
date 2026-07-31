import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FiHome, FiShield } from "react-icons/fi";
import AdminSidebarNav from "@/component/AdminSidebarNav";

export const metadata = {
  title: "Admin Dashboard | FujiMedical",
  description: "FujiMedical Product & Category Management Dashboard",
};

export default async function AdminLayout({ children }) {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  const user = session?.user;
  const isAdmin = user && user.role === "admin";

  if (!user) redirect("/login?redirectTo=/admin/products");
  if (!isAdmin) redirect("/");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* ── Dark Sidebar ── */}
      <aside className="w-full md:w-60 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand */}
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <FiShield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-black text-white text-sm leading-tight">FujiMedical</h2>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                Admin Panel
              </span>
            </div>
          </div>

          {/* Nav */}
          <AdminSidebarNav />
        </div>

        {/* User + storefront */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-2.5 px-3 py-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm shrink-0">
              {user.name ? user.name[0].toUpperCase() : "A"}
            </div>
            <div className="truncate min-w-0">
              <p className="font-bold text-slate-200 text-xs truncate">{user.name || "Admin"}</p>
              <p className="text-slate-500 text-[11px] truncate">{user.email}</p>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition border border-slate-700/50"
          >
            <FiHome className="w-3.5 h-3.5" /> Return to Store
          </Link>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 p-5 md:p-8 overflow-y-auto min-w-0 bg-slate-950">
        {children}
      </main>
    </div>
  );
}
