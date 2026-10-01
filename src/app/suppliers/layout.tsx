import DashboardShell from "../../components/layout/dashboard-shell";


export default function SupplierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}