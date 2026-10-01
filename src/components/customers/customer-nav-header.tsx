"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiUserPlus, FiUsers, FiDollarSign, FiList } from "react-icons/fi";

export default function CustomerNavHeader() {
  const pathname = usePathname();

  const navs = [
    { name: "Add New", href: "/customers/add", icon: FiUserPlus },
    { name: "View All", href: "/customers/all", icon: FiUsers },
    { name: "Customer Collection", href: "/customers/payments", icon: FiDollarSign },
    { name: "All Customer Collection", href: "/customers/all-payments", icon: FiList },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs mb-6">
      {navs.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
              isActive
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60"
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}