import Link from "next/link";
import { FiChevronDown, FiLogOut, FiX } from "react-icons/fi";
import { navigation } from "../../lib/navigation";

type SidebarProps = {
  mobile?: boolean;
};

export default function Sidebar({ mobile = false }: SidebarProps) {
  return (
    <aside
      className={`
        flex h-full w-[270px] flex-col
        bg-slate-950 text-white
        ${mobile ? "" : "hidden lg:flex"}
      `}
    >
      {/* Logo */}
      <div className="flex h-[76px] shrink-0 items-center border-b border-white/8 px-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
            <span className="text-lg font-bold">P</span>
          </div>

          <div>
            <h1 className="text-[17px] font-bold tracking-tight">
              Phone<span className="text-primary">Store</span>
            </h1>

            <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Management
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Main menu
        </p>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            if (item.children) {
              return (
                <details key={item.title} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-3 py-3 text-[13px] font-medium text-slate-300 transition hover:bg-white/6 hover:text-white">
                    <span className="flex items-center gap-3">
                      <Icon className="h-[18px] w-[18px]" />
                      {item.title}
                    </span>

                    <FiChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                  </summary>

                  <div className="relative ml-5 mt-1 space-y-1 border-l border-white/8 pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-lg px-3 py-2.5 text-[12px] text-slate-400 transition hover:bg-white/6 hover:text-white"
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                </details>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href ?? "#"}
                className={`
                  flex items-center gap-3 rounded-xl px-3 py-3
                  text-[13px] font-medium
                  transition
                  ${
                    item.href === "/dashboard"
                      ? "bg-primary text-white shadow-lg shadow-primary/15"
                      : "text-slate-300 hover:bg-white/6 hover:text-white"
                  }
                `}
              >
                <Icon className="h-[18px] w-[18px]" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom profile */}
      <div className="border-t border-white/8 p-3">
        <div className="flex items-center gap-3 rounded-xl bg-white/4 p-3">
          <div className="avatar placeholder">
            <div className="w-9 rounded-full bg-primary text-white">
              <span className="text-xs font-semibold">SA</span>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">
              Store Admin
            </p>

            <p className="truncate text-[10px] text-slate-500">
              Administrator
            </p>
          </div>

          <button className="btn btn-ghost btn-square btn-xs text-slate-500 hover:bg-white/5 hover:text-white">
            <FiLogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}