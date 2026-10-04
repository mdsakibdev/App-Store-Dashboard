import DashboardShell from "../../components/layout/dashboard-shell";


export default function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell>
      <div className="space-y-4">
       
        <div className="w-full">{children}</div>
      </div>
    </DashboardShell>
  );
}
