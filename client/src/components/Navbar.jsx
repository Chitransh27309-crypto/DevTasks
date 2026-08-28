import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context.jsx";

function Navbar() {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
        navigate("/login", { replace: true });
    };

    return (
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
            <div>
                <h2 className="text-lg font-semibold text-gray-800">
                    DevTask
                </h2>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
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