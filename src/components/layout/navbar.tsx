import {
  FiBell,
  FiChevronDown,
  FiMenu,
  FiSearch,
} from "react-icons/fi";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex w-full items-center gap-4">
        {/* Mobile menu */}
        <label
          htmlFor="mobile-sidebar"
          className="btn btn-ghost btn-square lg:hidden"
        >
          <FiMenu className="h-5 w-5" />
        </label>

        {/* Search */}
        <div className="relative hidden max-w-md flex-1 md:block">
          <FiSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="search"
            placeholder="Search anything..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Mobile search */}
          <button className="btn btn-ghost btn-square md:hidden">
            <FiSearch className="h-5 w-5" />
          </button>

          {/* Notification */}
          <button className="btn btn-ghost btn-square relative">
            <FiBell className="h-[19px] w-[19px] text-slate-600" />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error ring-2 ring-white" />
          </button>

          <div className="mx-1 hidden h-7 w-px bg-slate-200 sm:block" />

          {/* User */}
          <button className="flex items-center gap-3 rounded-xl p-1.5 pr-2 transition hover:bg-slate-50">
            <div className="avatar placeholder">
              <div className="w-9 rounded-xl bg-primary text-white">
                <span className="text-xs font-semibold">SA</span>
              </div>
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold text-slate-800">
                Store Admin
              </p>

              <p className="text-[10px] text-slate-400">
                Administrator
              </p>
            </div>

            <FiChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
          </button>
        </div>
      </div>
    </header>
  );
}