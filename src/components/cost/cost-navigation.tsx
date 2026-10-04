"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiDollarSign,
  FiLayers,
  FiList,
  FiPlusCircle,
  FiTag,
} from "react-icons/fi";

const items = [
  { label: "01. Cost Category", href: "/cost/categories", icon: FiTag },
  { label: "02. Field of Cost", href: "/cost/fields", icon: FiList },
  { label: "03. New Cost", href: "/cost/new", icon: FiPlusCircle },
  { label: "04. All Cost", href: "/cost", icon: FiLayers },
];

export default function CostNavigation() {
  const pathname = usePathname();

  return (
    <div className="mb-5 overflow-x-auto">
      <div className="flex min-w-max gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <Link
          href="/cost/categories"
          className="flex items-center gap-2 px-3 py-2 font-semibold text-slate-900"
        >
          <FiDollarSign className="h-4 w-4 text-primary" />
          <span>Cost</span>
        </Link>

        <div className="h-8 w-px self-center bg-slate-200" />

        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex h-10 items-center gap-2 rounded-xl px-4 text-xs font-semibold transition",
                active
                  ? "bg-primary text-primary-content shadow-sm"
                  : "text-gray-800 hover:bg-slate-100",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
