import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/auth.context.jsx";
import { getProjectById } from "../services/project.service.js";
import { getTasks, deleteTask } from "../services/task.service.js";
import TaskModal from "../components/TaskModal.jsx";

function ProjectDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { accessToken } = useAuth();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [tasks, setTasks] = useState([]);
    const [tasksLoading, setTasksLoading] = useState(true);
    const [tasksError, setTasksError] = useState("");
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [deletingTask, setDeletingTask] = useState(null);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [sort, setSort] = useState("createdAt");
    const [order, setOrder] = useState("desc");

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await getProjectById(id, accessToken);
                setProject(data.project);
            } catch (error) {
                console.error(
                    "Failed to fetch project:",
                    error.message
                );

                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (accessToken) {
            fetchProject();
        }
    }, [id, accessToken]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await getTasks(
                    id,
                    accessToken,
                    {
                        search,
                        status,
                        priority,
                        sort,
                        order
                    }
                );

                setTasks(data.tasks);
            } catch (error) {
                console.error(
                    "Failed to fetch tasks:",
                    error.message
                );

                setTasksError(error.message);
            } finally {
                setTasksLoading(false);
            }
        };

        if (accessToken && id) {
            fetchTasks();
        }
    }, [id, accessToken, search, status, priority, sort, order]);

    const handleDeleteTask = async () => {
        try {
            await deleteTask(
                id,
                deletingTask._id,
                accessToken
            );

            setTasks((prevTasks) =>
                prevTasks.filter(
                    (task) => task._id !== deletingTask._id
                )
            );

            setDeletingTask(null);

        } catch (error) {
            console.error(
                "Delete task error:",
                error.message
            );

            alert(error.message);
        }
    };

    if (loading) {
        return (
            <div className="text-gray-600">
                Loading project...
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                <p className="text-red-600">
                    {error}
                </p>

                <button
                    onClick={() => navigate("/projects")}
                    className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
                >
                    Back to Projects
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Back */}
            <button
                onClick={() => navigate("/projects")}
                className="cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-800"
            >
                ←  Back to Projects
            </button>

            {/* Project Header */}
            <div className="rounded-xl bg-white p-6 shadow-sm">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {project.name}
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            {project.description || "No description"}
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setSelectedTask(null);
                            setShowTaskModal(true);
                        }}
                        className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        + Add Task
                    </button>

                </div>

                {/* Technologies */}
                <div className="mt-5 flex flex-wrap gap-2">
                    {project.technologies?.map((technology) => (
                        <span
                            key={technology}
                            className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
                        >
                            {technology}
                        </span>
                    ))}
                </div>

                {/* Deadline */}
                {project.deadline && (
                    <p className="mt-5 text-sm text-gray-500">
                        Deadline:{" "}
                        {new Date(
                            project.deadline
                        ).toLocaleDateString()}
                    </p>
                )}

            </div>

            {/* Tasks */}
            <div>
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Tasks
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Manage tasks for this project.
                        </p>
                    </div>
                </div>
                <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search tasks..."
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500"
                    />

                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500"
                    >
                        <option value="">
                            All Status
                        </option>

                        <option value="todo">
                            Todo
                        </option>

                        <option value="in-progress">
                            In Progress
                        </option>

                        <option value="completed">
                            Completed
                        </option>
                    </select>

                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500"
                    >
                        <option value="">
                            All Priorities
                        </option>

                        <option value="low">
                            Low
                        </option>

                        <option value="medium">
                            Medium
                        </option>

                        <option value="high">
                            High
                        </option>
                    </select>

                    <select
                        value={`${sort}-${order}`}
                        onChange={(e) => {
                            const [newSort, newOrder] = e.target.value.split("-");

                            setSort(newSort);
                            setOrder(newOrder);
                        }}
                        className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500"
                    >
                        <option value="createdAt-desc">
                            Newest First
                        </option>

                        <option value="createdAt-asc">
                            Oldest First
                        </option>

                        <option value="dueDate-asc">
                            Earliest Due Date
                        </option>

                        <option value="dueDate-desc">
                            Latest Due Date
                        </option>

                        <option value="title-asc">
                            Title A-Z
                        </option>

                        <option value="title-desc">
                            Title Z-A
                        </option>
                    </select>

                </div>
                {/* Tasks */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    {tasksLoading ? (
                        <p className="text-gray-500">
                            Loading tasks...
                        </p>
                    ) : tasksError ? (
                        <p className="text-red-600">
                            {tasksError}
                        </p>
                    ) : tasks.length === 0 ? (
                        <div className="py-8 text-center">
                            <p className="text-gray-500">
                                No tasks yet.
                            </p>

                            <button
                                onClick={() => {
                                    setSelectedTask(null);
                                    setShowTaskModal(true);
                                }}
                                className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                + Add Task
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {<div className="grid gap-4 lg:grid-cols-3">
                                {/* TODO */}
                                <div className="rounded-xl bg-gray-100 p-4">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-900">
                                            Todo
                                        </h3>

                                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-500">
                                            {tasks.filter((task) => task.status === "todo").length}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {tasks
                                            .filter((task) => task.status === "todo")
                                            .map((task) => (
                                                <div
                                                    key={task._id}
                                                    className="rounded-lg bg-white p-4 shadow-sm"
                                                >
                                                    <h4 className="font-medium text-gray-900">
                                                        {task.title}
                                                    </h4>

                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {task.description || "No description"}
                                                    </p>

                                                    <div className="mt-3">
                                                        <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-600">
                                                            {task.priority}
                                                        </span>
                                                    </div>
                                                    <div className="mt-4 flex gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedTask(task);
                                                                setShowTaskModal(true);
                                                            }}
                                                            className="cursor-pointer rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            onClick={() => setDeletingTask(task)}
                                                            className="cursor-pointer rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                {/* IN PROGRESS */}
                                <div className="rounded-xl bg-blue-100 p-4">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-900">
                                            In Progress
                                        </h3>

                                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-500">
                                            {tasks.filter(
                                                (task) => task.status === "in-progress"
                                            ).length}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {tasks
                                            .filter((task) => task.status === "in-progress")
                                            .map((task) => (
                                                <div
                                                    key={task._id}
                                                    className="rounded-lg bg-white p-4 shadow-sm"
                                                >
                                                    <h4 className="font-medium text-gray-900">
                                                        {task.title}
                                                    </h4>

                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {task.description || "No description"}
                                                    </p>

                                                    <div className="mt-3">
                                                        <span className="rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-600">
                                                            {task.priority}
                                                        </span>
                                                    </div>
                                                    <div className="mt-4 flex gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedTask(task);
                                                                setShowTaskModal(true);
                                                            }}
                                                            className="cursor-pointer rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            onClick={() => setDeletingTask(task)}
                                                            className="cursor-pointer rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                {/* COMPLETED */}
                                <div className="rounded-xl bg-green-100 p-4">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-900">
                                            Completed
                                        </h3>

                                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-500">
                                            {tasks.filter(
                                                (task) => task.status === "completed"
                                            ).length}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {tasks
                                            .filter((task) => task.status === "completed")
                                            .map((task) => (
                                                <div
                                                    key={task._id}
                                                    className="rounded-lg bg-white p-4 shadow-sm"
                                                >
                                                    <h4 className="font-medium text-gray-900">
                                                        {task.title}
                                                    </h4>

                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {task.description || "No description"}
                                                    </p>

                                                    <div className="mt-3">
                                                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">
                                                            {task.priority}
                                                        </span>
                                                    </div>
                                                    <div className="mt-4 flex gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedTask(task);
                                                                setShowTaskModal(true);
                                                            }}
                                                            className="cursor-pointer rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            onClick={() => setDeletingTask(task)}
                                                            className="cursor-pointer rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>}
                        </div>
                    )}
                </div>
            </div>

            {showTaskModal && (
                <TaskModal
                    projectId={id}
                    task={selectedTask}
                    onClose={() => {
                        setShowTaskModal(false);
                        setSelectedTask(null);
                    }}
                    onTaskCreated={(task) => {
                        setTasks((prevTasks) => [
                            task,
                            ...prevTasks
                        ]);
                    }}
                    onTaskUpdated={(updatedTask) => {
                        setTasks((prevTasks) =>
                            prevTasks.map((task) =>
                                task._id === updatedTask._id
                                    ? updatedTask
                                    : task
                            )
                        );
                    }}
                />
            )}
            {deletingTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

                        <h2 className="text-xl font-semibold text-gray-900">
                            Delete Task?
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Are you sure you want to delete{" "}
                            <span className="font-medium text-gray-700">
                                {deletingTask.title}
                            </span>
                            ?
                        </p>

                        <p className="mt-2 text-sm text-red-500">
                            This action cannot be undone.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setDeletingTask(null)}
                                className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDeleteTask}
                                className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                            >
                                Delete
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProjectDetails;