import CustomerNavHeader from "../../../components/customers/customer-nav-header";
import AllCollectionsTable from "../../../components/customers/all-collections-table";

export default function AllCustomerCollectionPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-12">
      {/* Top Header Tabs */}
      <div className="no-print">
        <CustomerNavHeader />
      </div>

      {/* Collection Report Table */}
      <AllCollectionsTable />
    </div>
  );
}