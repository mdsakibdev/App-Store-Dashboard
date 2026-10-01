import SupplierTable from "../../../components/suppliers/supplier-table";



export default function AllSupplierPage() {
  return (
    <main>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Supplier Management
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          All Suppliers
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View and manage all suppliers, balances and contact information.
        </p>
      </div>

      <SupplierTable />
    </main>
  );
}