import {
  FiDollarSign,
  FiShoppingCart,
  FiPackage,
  FiUsers,
  FiRotateCcw,
  FiTrendingUp,
} from "react-icons/fi";

import DashboardShell from "../../components/layout/dashboard-shell";
import StatCard from "../../components/dashboard/stat-card";
import SalesOverview from "../../components/dashboard/sales-overview";
import RecentProducts from "../../components/dashboard/recent-products";
import QuickActions from "../../components/dashboard/quick-actions";

const stats = [
  {
    title: "Total Sales",
    value: "$84,520",
    change: "+12.8%",
    description: "vs last month",
    icon: FiDollarSign,
    trend: "up" as const,
    iconClass: "bg-blue-50 text-blue-600",
  },
  {
    title: "Total Purchases",
    value: "$52,340",
    change: "+8.4%",
    description: "vs last month",
    icon: FiShoppingCart,
    trend: "up" as const,
    iconClass: "bg-violet-50 text-violet-600",
  },
  {
    title: "Products",
    value: "1,284",
    change: "+24",
    description: "this month",
    icon: FiPackage,
    trend: "up" as const,
    iconClass: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Customers",
    value: "3,842",
    change: "+6.2%",
    description: "vs last month",
    icon: FiUsers,
    trend: "up" as const,
    iconClass: "bg-amber-50 text-amber-600",
  },
  {
    title: "Returns",
    value: "38",
    change: "-4.1%",
    description: "vs last month",
    icon: FiRotateCcw,
    trend: "down" as const,
    iconClass: "bg-rose-50 text-rose-600",
  },
  {
    title: "Net Profit",
    value: "$32,180",
    change: "+15.3%",
    description: "vs last month",
    icon: FiTrendingUp,
    trend: "up" as const,
    iconClass: "bg-cyan-50 text-cyan-600",
  },
];

export default function DashboardPage() {
  return (
    <DashboardShell>
      {/* Page header */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium text-primary">
            Overview
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-2 text-xs text-slate-500 sm:text-sm">
            Welcome back, Store Admin. Here&apos;s what&apos;s happening today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn btn-sm border-slate-200 bg-white text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50">
            Export Report
          </button>

          <button className="btn btn-sm btn-primary text-xs shadow-md shadow-primary/20">
            + New Sale
          </button>
        </div>
      </div>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      {/* Main content */}
      <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <SalesOverview />

        <QuickActions />
      </section>

      {/* Products */}
      <section className="mt-5">
        <RecentProducts />
      </section>
    </DashboardShell>
  );
}