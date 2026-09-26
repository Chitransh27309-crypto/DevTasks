import { NavLink } from "react-router-dom";
import devtaskLogo from "../assets/DevTask.png";
import dashboardIcon from "../assets/dashboard.png";
import projectsIcon from "../assets/setting.png";

function Sidebar({ onNavigate }) {
    return (
        <aside className="sticky top-0 h-screen w-64 shrink-0 border-r border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-6 py-5">
                < div className="flex items-center gap-2">
                    <img src={devtaskLogo} alt="DevTask Logo" className="h-8 w-8" />
                    <h1 className="text-lg font-semibold text-blue-500">
                        DevTask
                    </h1>
                </div>
            </div>

            <nav className="p-4">
               <NavLink
                    to="/dashboard"
                    onClick={onNavigate}
                    className={({ isActive }) =>
                        `mb-2 block rounded-lg px-4 py-3 text-sm font-medium ${isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50"
                        }`
                    }
                >
                    <div className="flex items-center gap-2 rounded-lg">
                        <img src={dashboardIcon} alt="Dashboard" className="mb-2 h-5 w-5" />
                        <p>Dashboard</p>
                    </div>
                </NavLink>

                <NavLink
                    to="/projects"
                    onClick={onNavigate}
                    className={({ isActive }) =>
                        `block rounded-lg px-4 py-3 text-sm font-medium ${isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50"
                        }`
                    }
                >
                    <div className="flex items-center gap-2 rounded-lg">
                        <img src={projectsIcon} alt="Projects" className="mb-2 h-5 w-5" />
                        <p>Projects</p>
                    </div>
                </NavLink>
            </nav>
        </aside>
    );
}

export default Sidebar;