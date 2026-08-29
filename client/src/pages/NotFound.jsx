import { useNavigate } from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900">
                    404
                </h1>

                <p className="mt-3 text-gray-500">
                    The page you're looking doesn't exist.
                </p>

                <button
                    onClick={() => navigate("/dashboard")}
                    className="mt-5 cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
}

export default NotFound;