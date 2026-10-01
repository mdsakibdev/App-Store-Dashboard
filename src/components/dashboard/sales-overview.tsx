const points = [
  "18,145",
  "68,126",
  "118,137",
  "168,102",
  "218,116",
  "268,84",
  "318,92",
  "368,61",
  "418,73",
  "468,42",
  "518,55",
  "568,25",
];

export default function SalesOverview() {
  const line = points.join(" ");

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Sales Overview
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Monthly sales performance
          </p>
        </div>

        <select className="select select-sm w-full border-slate-200 bg-slate-50 text-xs sm:w-auto">
          <option>Last 12 months</option>
          <option>Last 6 months</option>
          <option>This year</option>
        </select>
      </div>

      <div className="mt-7 overflow-hidden">
        <div className="h-[270px] w-full">
          <svg
            viewBox="0 0 600 180"
            preserveAspectRatio="none"
            className="h-full w-full"
          >
            {/* Grid */}
            <line
              x1="0"
              y1="30"
              x2="600"
              y2="30"
              stroke="currentColor"
              className="text-slate-100"
            />

            <line
              x1="0"
              y1="75"
              x2="600"
              y2="75"
              stroke="currentColor"
              className="text-slate-100"
            />

            <line
              x1="0"
              y1="120"
              x2="600"
              y2="120"
              stroke="currentColor"
              className="text-slate-100"
            />

            <line
              x1="0"
              y1="165"
              x2="600"
              y2="165"
              stroke="currentColor"
              className="text-slate-100"
            />

            {/* Area */}
            <polygon
              points={`0,165 ${line} 600,165`}
              className="fill-primary/8"
            />

            {/* Line */}
            <polyline
              points={line}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            />

            {/* Last point */}
            <circle
              cx="568"
              cy="25"
              r="5"
              className="fill-primary"
            />

            <circle
              cx="568"
              cy="25"
              r="9"
              className="fill-primary/15"
            />
          </svg>
        </div>

        <div className="mt-2 flex justify-between text-[10px] text-slate-400">
          <span>Oct</span>
          <span>Nov</span>
          <span>Dec</span>
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
          <span>Jul</span>
          <span>Aug</span>
          <span>Sep</span>
        </div>
      </div>
    </div>
  );
}