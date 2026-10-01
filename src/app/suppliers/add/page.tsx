import SupplierForm from "../../../components/suppliers/supplier-form";

export default function AddSupplierPage() {
  return (
    <main>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Supplier Management
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Add Supplier
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Create a supplier profile and set their opening balance.
        </p>
      </div>

      <SupplierForm />
    </main>
  );
}