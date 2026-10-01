import CustomerNavHeader from "../../../components/customers/customer-nav-header";
import CustomerTable from "../../../components/customers/customer-table";

export default function ViewAllCustomersPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-12">
      {/* Top Navigation Header Tabs */}
      <div className="no-print">
        <CustomerNavHeader />
      </div>

      {/* Customer Data Table Component */}
      <CustomerTable />
    </div>
  );
}