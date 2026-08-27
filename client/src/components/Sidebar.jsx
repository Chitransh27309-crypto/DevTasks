import { NavLink } from "react-router-dom";

function Sidebar() {
    return (
        <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white md:block">
            <div className="border-b border-gray-200 px-6 py-5">
                <h1 className="text-2xl font-bold text-blue-600">DevTask</h1>
            </div>

            <nav className="p-4">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `mb-2 block rounded-lg px-4 py-3 text-sm font-medium ${isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50"
                        }`
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/projects"
                    className={({ isActive }) =>
                        `block rounded-lg px-4 py-3 text-sm font-medium ${isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50"
                        }`
                    }
                >
                    Projects
                </NavLink>
            </nav>
        </aside>
    );
}

export default Sidebar;