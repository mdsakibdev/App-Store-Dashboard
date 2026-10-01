import DashboardShell from "../../components/layout/dashboard-shell";
import BrandsClient from "../../components/brands/brands-client";
import { brands } from "../../lib/mock-data";

export default function BrandsPage() {
  return (
    <DashboardShell>
      <div className="mb-7">
        <p className="text-xs font-medium text-primary">
          Products
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Brands
        </h1>

        <p className="mt-2 text-xs text-slate-500 sm:text-sm">
          Manage and organize your product brands.
        </p>
      </div>

      <BrandsClient initialBrands={brands} />
    </DashboardShell>
  );
}