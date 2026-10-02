import AddPurchaseForm from "../../../components/purchase/add-purchase-form";

export default function AddPurchasePage() {
  return (
    <div className="space-y-4">
      {/* Page Title Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h1 className="text-lg font-bold text-slate-800">Add Purchase</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Create new purchase invoices from suppliers and manage inventory stock entries.
        </p>
      </div>

      {/* Main Dynamic Purchase Form */}
      <AddPurchaseForm />
    </div>
  );
}