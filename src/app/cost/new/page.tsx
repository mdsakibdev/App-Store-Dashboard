import CostNavigation from "../../../components/cost/cost-navigation";
import { NewCostForm } from "../../../components/cost/new-cost-form"

export default function NewCostPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Expense / Cost</h1>
          <p className="text-sm text-muted-foreground">
            Create and record a new company expense or cost entry.
          </p>
        </div>
      </div>

      <CostNavigation />

      <div className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm">
        <NewCostForm />
      </div>
    </div>
  );
}