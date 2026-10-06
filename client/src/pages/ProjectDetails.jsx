import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/auth.context.jsx";
import { getProjectById } from "../services/project.service.js";
import { getTasks, deleteTask } from "../services/task.service.js";
import TaskModal from "../components/TaskModal.jsx";
import Loading from "../components/Loading.jsx";
import editButton from "../assets/edit-button.png";
import deleteButton from "../assets/delete.png";
import cancelButton from "../assets/letter-x.png";
import BackBtn from "../assets/back.png";
import addIcon from "../assets/plus.png";
import searchIcon from "../assets/search.png";

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
                console.error("Failed to fetch project:", error?.message);
                setError(error?.message);
            } finally {
                setLoading(false);
            }
        };

        if (accessToken) {
            fetchProject();
        }
    }, [id, accessToken]);

    useEffect(() => {
        setTasksLoading(true);
        setTasksError("");
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
                console.error("Failed to fetch tasks:", error?.message);
                setTasksError(error?.message);
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

            setTasks((prevTasks) => prevTasks.filter((task) => task._id !== deletingTask._id));
            setDeletingTask(null);

        } catch (error) {
            console.error("Delete task error:", error?.message);
            alert(error?.message);
        }
    };

    if (loading) {
        return <Loading />
    }

    if (error) {
        return (
            <div className="space-y-4">
                <p className="text-red-600"> {error} </p>

                <button
                    onClick={() => navigate("/projects")}
                    className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
                >
                    <img src={BackBtn} alt="Back" className="h-4 w-4" />
                    Back to Projects
                </button>
            </div>
        );
    }
    const taskColumns = [
        {
            status: "todo",
            title: "Todo",
            bg: "bg-red-300",
            priorityBgL: "bg-red-100",
            priorityBgM: "bg-red-200",
            priorityBgH: "bg-red-300",
            priorityText: "text-red-900"
        },
        {
            status: "in-progress",
            title: "In Progress",
            bg: "bg-blue-200",
            priorityBgL: "bg-yellow-100",
            priorityBgM: "bg-yellow-200",
            priorityBgH: "bg-yellow-300",
            priorityText: "text-yellow-900"
        },
        {
            status: "completed",
            title: "Completed",
            bg: "bg-green-100",
            priorityBgL: "bg-green-100",
            priorityBgM: "bg-green-200",
            priorityBgH: "bg-green-300",
            priorityText: "text-green-900"
        }
    ];
    return (
        <div className="space-y-6">

            {/* Back */}
            <button
                onClick={() => navigate("/projects")}
                className="cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-800"
            >
                <img src={BackBtn} alt="Back" className="h-4 w-4 inline-block mr-1" /> back to Projects
            </button>

            {/* Project Header */}
            <div className="rounded-xl bg-white p-6 shadow-sm">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900"> {project.name} </h1>
                        <p className="mt-2 text-sm text-gray-500"> {project.description || "No description"} </p>
                    </div>

                    <button
                        onClick={() => {
                            setSelectedTask(null);
                            setShowTaskModal(true);
                        }}
                        className="cursor-pointer rounded-lg bg-blue-400 px-4 py-2 flex items-center justify-center font-medium text-white hover:bg-blue-500"
                    >
                        <img src={addIcon} alt="Add" className="h-5 w-5" />
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

                    <div className="flex h-12 w-92.5 max-w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 shadow-sm transition-all duration-200 hover:border-blue-500 hover:shadow-md focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                        <img
                            src={searchIcon}
                            alt="Search"
                            className="h-5 w-5 shrink-0 transition-opacity duration-200 group-focus-within:opacity-100"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search tasks..."
                            className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="cursor-pointer rounded-full px-2"
                            >
                                {cancelButton && (
                                    <img
                                        src={cancelButton}
                                        alt="Cancel"
                                        className="h-4 w-5"
                                    />
                                )}
                            </button>
                        )}
                    </div>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="h-12 w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 shadow-sm outline-none transition-all duration-200 hover:border-blue-500 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    >
                        <option value="">All Status</option>
                        <option value="todo">Todo</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>

                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="h-12 w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 shadow-sm outline-none transition-all duration-200 hover:border-blue-500 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"                    >
                        <option value=""> All Priorities </option>
                        <option value="low">  Low </option>
                        <option value="medium"> Medium </option>
                        <option value="high"> High</option>
                    </select>

                    <select
                        value={`${sort}-${order}`}
                        onChange={(e) => {
                            const [newSort, newOrder] = e.target.value.split("-");

                            setSort(newSort);
                            setOrder(newOrder);
                        }}
                        className="h-12 w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 shadow-sm outline-none transition-all duration-200 hover:border-blue-500 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"                    >
                        <option value="createdAt-desc"> Newest First</option>
                        <option value="createdAt-asc">  Oldest First  </option>
                        <option value="dueDate-asc"> Earliest Due Date </option>
                        <option value="dueDate-desc"> Latest Due Date </option>
                        <option value="title-asc"> Title A-Z </option>
                        <option value="title-desc"> Title Z-A </option>
                    </select>

                </div>
                {/* Tasks */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    {tasksLoading ? (
                        <Loading />
                    ) : tasksError ? (
                        <p className="text-red-600">
                            {tasksError}
                        </p>
                    ) : tasks.length === 0 ? (
                        <div className="py-8 text-center">
                            <h3 className="text-lg font-semibold text-gray-900">
                                No tasks yet
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                Create your first task for this project.
                            </p>

                            <button
                                onClick={() => {
                                    setSelectedTask(null);
                                    setShowTaskModal(true);
                                }}
                                className="cursor-pointer rounded-lg bg-blue-400 px-4 py-2 mt-2 font-medium text-white hover:bg-blue-500"
                            >
                                <img src={addIcon} alt="Add" className="h-5 w-5" />
                            </button>
                        </div>
                    ) : (<div className="grid gap-4 lg:grid-cols-3">
                        {taskColumns.map((column) => (
                            <div
                                key={column.status}
                                className={`rounded-xl ${column.bg} p-4`}
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-900">
                                        {column.title}
                                    </h3>

                                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-500">
                                        {tasks.filter((task) => task.status === column.status).length}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {tasks
                                        .filter((task) => task.status === column.status)
                                        .map((task) => (
                                            <div
                                                key={task._id}
                                                className="rounded-lg bg-white p-4 shadow-sm hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-medium text-gray-900">
                                                        {task.title}
                                                    </h4>
                                                    <span
                                                        className={`rounded-full ${task.priority === "low" ? column.priorityBgL : task.priority === "medium" ? column.priorityBgM : column.priorityBgH} px-2.5 py-1 text-xs font-medium ${column.priorityText}`}
                                                    >
                                                        {task.priority}
                                                    </span>
                                                </div>


                                                <p className="mt-1 text-sm text-gray-500">
                                                    {task.description || "No description"}
                                                </p>

                                                <div className="mt-3">

                                                    {task.dueDate && (
                                                        <p className="mt-2 text-sm text-gray-500">
                                                            Due: {new Date(task.dueDate).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="mt-4 flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedTask(task);
                                                            setShowTaskModal(true);
                                                        }}
                                                        className="cursor-pointer rounded-lg px-3 py-1.5 hover:bg-gray-100"
                                                    >
                                                        <img src={editButton} alt="Edit" className="h-4 w-4" />
                                                    </button>

                                                    <button
                                                        onClick={() => setDeletingTask(task)}
                                                        className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                                                    >
                                                        <img src={deleteButton} alt="Delete" className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>)}
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

                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900"> Delete Task? </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setDeletingTask(null)}
                                className="cursor-pointer text-3xl text-gray-400 hover:text-gray-600"
                            >
                                <img src={cancelButton} alt="Cancel" className="h-4 w-4" />
                            </button>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            Are you sure you want to delete{" "}
                            <span className="font-medium text-gray-700">
                                {deletingTask.title}
                            </span>
                            ?
                        </p>
                        <p className="mt-2 text-sm text-red-500"> This action cannot be undone. </p>

                        <div className="mt-6 flex justify-end gap-3">

                            <button
                                onClick={handleDeleteTask}
                                className="cursor-pointer rounded-lg bg-red-300 px-4 py-2  hover:bg-red-500"
                            >
                                <img src={deleteButton} alt="Delete" className="h-4 w-4" />
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProjectDetails;