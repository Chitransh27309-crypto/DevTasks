import { useAuth } from "../context/auth.context.jsx";

function Navbar() {
    const { user } = useAuth();

    return (
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
            <div>
                <h2 className="text-lg font-semibold text-gray-800">DevTask</h2>
            </div>
            <div className="text-sm text-gray-600">{user?.name}</div>
        </header>
    );
}

export default Navbar;