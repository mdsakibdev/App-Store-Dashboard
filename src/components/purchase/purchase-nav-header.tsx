"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiPlusSquare,
  FiList,
  FiGrid,
  FiRotateCcw,
  FiClock,
} from "react-icons/fi";

export default function PurchaseNavHeader() {
  const pathname = usePathname();

  const navItems = [
    { name: "Add Purchase", href: "/purchase/add", icon: FiPlusSquare },
    { name: "All Purchase", href: "/purchase/all", icon: FiList },
    { name: "Item Wise", href: "/purchase/item-wise", icon: FiGrid },
    { name: "Add Purchase Return", href: "/purchase/return/add", icon: FiRotateCcw },
    { name: "All Purchase Return", href: "/purchase/return/all", icon: FiClock },
  ];

  return (
    <div className="bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-2 overflow-x-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`h-10 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap ${
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