import DashboardShell from "../../components/layout/dashboard-shell";
import CategoriesClient from "../../components/categories/categories-client";
import { categories } from "../../lib/mock-data";

export default function CategoriesPage() {
  return (
    <DashboardShell>
      <div className="mb-7">
        <p className="text-xs font-medium text-primary">
          Products
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Categories
        </h1>

        <p className="mt-2 text-xs text-slate-500 sm:text-sm">
          Organize and manage your product categories.
        </p>
      </div>

      <CategoriesClient
        initialCategories={categories}
      />
    </DashboardShell>
  );
}