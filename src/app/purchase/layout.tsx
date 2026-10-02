import DashboardShell from "../../components/layout/dashboard-shell";
import PurchaseNavHeader from "../../components/purchase/purchase-nav-header";

export default function PurchaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell>
      <div className="space-y-4">
        {/* Purchase Navigation Header Tabs */}
        <PurchaseNavHeader />

        {/* Dynamic Page Content */}
        <div className="w-full">{children}</div>
      </div>
    </DashboardShell>
  );
}



