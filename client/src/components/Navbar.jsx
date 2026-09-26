import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context.jsx";
import hamburgerIcon from "../assets/hamburger.png";
import logoutIcon from "../assets/logout.png";

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
                    <img src={hamburgerIcon} alt="Menu" className="h-8 w-8" />
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
                    className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-red-400 bg-red-50 hover:bg-red-100"
                >
                    <div className="flex items-center gap-2">
                        <img src={logoutIcon} alt="Logout" className="h-4 w-4" />
                        <p>Logout</p>
                    </div>
                </button>
            </div>
        </header>
    );
}

export default Navbar;