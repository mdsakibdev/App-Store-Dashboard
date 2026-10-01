import CustomerNavHeader from "../../../components/customers/customer-nav-header";
import CustomerCollectionForm from "../../../components/customers/customer-collection-form";

export default function CustomerCollectionPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-12">
      {/* Navigation Header Tabs */}
      <CustomerNavHeader />

      {/* Page Title Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs mb-4">
        <h1 className="text-lg font-bold text-slate-800 tracking-tight">Customer Collection</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Receive due payments or installment collections from registered customers.
        </p>
      </div>

      {/* Collection Form */}
      <CustomerCollectionForm />
    </div>
  );
}