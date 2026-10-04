import  CostNavigation  from "../../components/cost/cost-navigation";
import { AllCostList } from "../../components/cost/all-cost-list";

export default function AllCostPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">All Expenses / Cost List</h1>
          <p className="text-sm text-gray-500">
            View, search, and manage all recorded company expenses.
          </p>
        </div>
      </div>

      {/* Cost Top Navigation */}
      <CostNavigation />

      {/* Main Container - Explicit Solid White Background */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <AllCostList />
      </div>
    </div>
  );
}