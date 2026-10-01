import {
  FiAlertTriangle,
  FiBox,
  FiPackage,
  FiXCircle,
} from "react-icons/fi";


import DashboardShell from "../../components/layout/dashboard-shell";
import { products } from "../../lib/mock-data";
import ProductsClient from "../../components/products-frontend-experience/products-client";

export default function ProductsPage() {
  return (
    <DashboardShell>
      {/* Page Header */}
      <div className="mb-7">
        <p className="text-xs font-medium text-primary">
          Inventory
        </p>

        <div className="mt-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Products
          </h1>

          <p className="mt-2 text-xs text-slate-500 sm:text-sm">
            Manage products, pricing, stock and warranty
            information.
          </p>
        </div>
      </div>

      <ProductsClient initialProducts={products} />
    </DashboardShell>
  );
}