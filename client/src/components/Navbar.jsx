import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context.jsx";

function Navbar({ onMenuClick }) {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
        navigate("/login", { replace: true });
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
            <div className="flex items-center gap-3">

                {/* Mobile menu */}
                <button
                    onClick={onMenuClick}
                    className="cursor-pointer rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
                    aria-label="Open menu"
                >
                    ☰
                </button>

                <h2 className="text-lg font-semibold text-gray-800">
                    DevTask
                </h2>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">

                <span className="hidden text-sm text-gray-600 sm:block">
                    {user?.name}
                </span>

                <button
                    onClick={handleLogout}
                    className="cursor-pointer rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                    Logout
                </button>
            </div>
        </header>
    );
}

export default Navbar;