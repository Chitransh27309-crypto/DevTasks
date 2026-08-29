import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";

function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* Desktop sidebar */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Mobile sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                >
                    <div
                        className="h-full min-h-screen w-64 bg-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Sidebar
                            onNavigate={() => setSidebarOpen(false)}
                        />
                    </div>
                </div>
            )}

            <div className="flex min-w-0 flex-1 flex-col">
                <Navbar
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="flex-1 p-4 sm:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;