import type { IconType } from "react-icons";
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  description: string;
  icon: IconType;
  trend: "up" | "down";
  iconClass: string;
};

export default function StatCard({
  title,
  value,
  change,
  description,
  icon: Icon,
  trend,
  iconClass,
}: StatCardProps) {
  const isUp = trend === "up";

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>

          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 text-xs font-semibold ${
            isUp ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {isUp ? (
            <FiArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <FiArrowDownRight className="h-3.5 w-3.5" />
          )}

          {change}
        </span>

        <span className="text-[11px] text-slate-400">
          {description}
        </span>
      </div>
    </div>
  );
}