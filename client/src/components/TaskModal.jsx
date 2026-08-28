import { useState } from "react";
import { createTask, updateTask } from "../services/task.service.js";
import { useAuth } from "../context/auth.context.jsx";

function TaskModal({
    projectId,
    task = null,
    onClose,
    onTaskCreated,
    onTaskUpdated
}) {
    const { accessToken } = useAuth();

    const [formData, setFormData] = useState({
        title: task?.title || "",
        description: task?.description || "",
        status: task?.status || "todo",
        priority: task?.priority || "medium",
        dueDate: task?.dueDate
            ? task.dueDate.split("T")[0]
            : ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            setError("Task title is required");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const taskData = {
                title: formData.title,
                description: formData.description,
                status: formData.status,
                priority: formData.priority,
                dueDate: formData.dueDate || undefined
            };

            if (task) {
                const data = await updateTask(
                    projectId,
                    task._id,
                    taskData,
                    accessToken
                );

                onTaskUpdated(data.task);
            } else {
                const data = await createTask(
                    projectId,
                    taskData,
                    accessToken
                );

                onTaskCreated(data.task);
            }

            onClose();

        } catch (error) {
            console.error("Task save error:", error.message);

            setError(error.message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">

                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {task ? "Edit Task" : "Create Task"}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {task
                                ? "Update your task details."
                                : "Add a new task to this project."}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer text-xl text-gray-400 hover:text-gray-600"
                    >
                        ×
                    </button>
                </div>

                {error && (
                    <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Task Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Build dashboard"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the task..."
                            rows="4"
                            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Status
                            </label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                            >
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
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Priority
                            </label>

                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                            >
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
                        </div>

                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Due Date
                        </label>

                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            className="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">

                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading
                                ? "Saving..."
                                : task
                                    ? "Save Changes"
                                    : "Create Task"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
}

export default TaskModal;