import Sidebar from "./sidebar";
import Navbar from "./navbar";

type DashboardShellProps = {
    children: React.ReactNode;
};

export default function DashboardShell({
    children,
}: DashboardShellProps) {
    return (
        <div className="min-h-screen bg-[#f6f7fb]">
            {/* Desktop Sidebar */}
            <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
                <Sidebar />
            </div>

            {/* Mobile drawer */}
            <div className="drawer lg:hidden">
                <input
                    id="mobile-sidebar"
                    type="checkbox"
                    className="drawer-toggle"
                />

                <div className="drawer-side z-50">
                    <label
                        htmlFor="mobile-sidebar"
                        aria-label="close sidebar"
                        className="drawer-overlay"
                    />

                    <Sidebar mobile />
                </div>
            </div>

            {/* Main */}
            <div className="min-w-0 overflow-x-hidden lg:pl-[270px]">
                <Navbar />

                <main className="min-h-[calc(100vh-76px)] min-w-0 overflow-x-hidden p-4 sm:p-6 lg:p-8">
                    <div className="mx-auto w-full min-w-0 max-w-[1600px]">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}