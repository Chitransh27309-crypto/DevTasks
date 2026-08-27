import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboard.service";
import { useAuth } from "../context/auth.context.jsx";

function Dashboard() {
    const { accessToken } = useAuth();

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats(accessToken);
                setStats(data.stats);

            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error.message);
                setError(error.message)

            } finally {
                setLoading(false);
            }
        };

        if (accessToken) {
            fetchStats();
        }
    }, [accessToken]);

    if (loading) {
        return (
            <div className="text-gray-600">
                Loading dashboard...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-600">
                {error}
            </div>
        );
    }
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">Here's an overview of your DevTask workspace</p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Total Projects
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-gray-900">
                        {stats.totalProjects}
                    </h2>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Total Tasks
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-gray-900">
                        {stats.totalTasks}
                    </h2>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Completed
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-gray-900">
                        {stats.completedTasks}
                    </h2>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        In Progress
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-gray-900">
                        {stats.inProgressTasks}
                    </h2>
                </div>
            </div>

            {/* Progress */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Overall Progress</h2>
                        <p className="mt-1 text-sm text-gray-500">Task completion across your workspace</p>
                    </div>

                    <span className="text-lg font-bold text-blue-600">
                        {stats.completionPercentage}%
                    </span>
                </div>

                <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${stats.completionPercentage}%` }}
                    />
                </div>
            </div>

            {/* Quick actions */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Projects
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your software projects and their tasks.
                    </p>

                    <button className="cursor-pointer mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        View Projects
                    </button>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Tasks
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Stay on top of your pending and active tasks.
                    </p>

                    <button className="cursor-pointer mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        View Tasks
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;