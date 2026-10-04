import DashboardShell from "../../components/layout/dashboard-shell";
import SalesNavHeader from "../../components/sales/sales-nav-header";

export default function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell>
      <div className="space-y-4">
        <SalesNavHeader />
        <div className="w-full">{children}</div>
      </div>
    </DashboardShell>
  );
}
