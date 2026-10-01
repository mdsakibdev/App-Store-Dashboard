import Link from "next/link";
import {
  FiPlus,
  FiShoppingCart,
  FiUserPlus,
  FiPackage,
} from "react-icons/fi";

const actions = [
  {
    title: "Add Product",
    description: "Create a new product",
    href: "/products/new",
    icon: FiPlus,
  },
  {
    title: "New Sale",
    description: "Create a sales invoice",
    href: "/sales/new",
    icon: FiShoppingCart,
  },
  {
    title: "Add Customer",
    description: "Register new customer",
    href: "/customers/new",
    icon: FiUserPlus,
  },
  {
    title: "Purchase Stock",
    description: "Add incoming stock",
    href: "/purchases/new",
    icon: FiPackage,
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="text-base font-bold text-slate-900">
          Quick Actions
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          Common tasks
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-primary/20 hover:bg-primary/5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition group-hover:bg-primary group-hover:text-white">
                <Icon className="h-[18px] w-[18px]" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800">
                  {action.title}
                </p>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  {action.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}