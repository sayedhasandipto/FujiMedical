"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBox, FiGrid, FiClipboard } from "react-icons/fi";

export default function AdminSidebarNav() {
  const pathname = usePathname();

  const links = [
    { href: "/admin/products", label: "Products", icon: FiBox },
    { href: "/admin/orders", label: "Orders", icon: FiClipboard },
    { href: "/admin/categories", label: "Categories", icon: FiGrid },
  ];

  return (
    <nav className="p-3 space-y-1">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 pt-3 pb-1.5">
        Management
      </p>

      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 group ${
              isActive
                ? "text-emerald-400 bg-emerald-950/40 border-l-2 border-emerald-500 pl-2.5"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-350"}`} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
