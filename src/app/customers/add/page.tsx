import CustomerNavHeader from "../../../components/customers/customer-nav-header";
import CustomerForm from "../../../components/customers/customer-form";

export default function AddCustomerPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-12">
      {/* Top Navigation Bar Header */}
      <CustomerNavHeader />

      {/* Page Title Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs mb-4">
        <h1 className="text-lg font-bold text-slate-800 tracking-tight">Add New Customer</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Fill in the customer information including personal, contact, and guarantor details.
        </p>
      </div>

      {/* Main Customer Form */}
      <CustomerForm />
    </div>
  );
}