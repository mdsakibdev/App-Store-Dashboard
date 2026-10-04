"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiClock,
  FiFileText,
  FiGrid,
  FiList,
  FiPlusSquare,
  FiRefreshCw,
  FiSearch,
  FiUser,
} from "react-icons/fi";

const navItems = [
  { name: "Retail Sale", href: "/sales/retail", icon: FiPlusSquare },
  { name: "Due Sale", href: "/sales/due", icon: FiClock },
  { name: "All Sale", href: "/sales", icon: FiList },
  { name: "Quotation", href: "/sales/quotation", icon: FiFileText },
  { name: "All Quotation", href: "/sales/quotations", icon: FiGrid },
  { name: "Search Item Wise", href: "/sales/item-wise", icon: FiSearch },
  { name: "Search Client Wise", href: "/sales/client-wise", icon: FiUser },
  { name: "Sale Return", href: "/sales/returns", icon: FiRefreshCw },
  { name: "All Sale Return", href: "/sales/returns/all", icon: FiList },
];

export default function SalesNavHeader() {
  const pathname = usePathname();

  return (
    <div className="bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-2 overflow-x-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`h-10 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap shrink-0 ${
              isActive
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
