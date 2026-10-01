import SupplierPaymentForm from "../../../components/suppliers/supplier-payment-form";


export default function SupplierPaymentPage() {
  return (
    <main>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Supplier Management
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Supplier Payment
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Record supplier payments and receiving transactions.
        </p>
      </div>

      <SupplierPaymentForm />
    </main>
  );
}