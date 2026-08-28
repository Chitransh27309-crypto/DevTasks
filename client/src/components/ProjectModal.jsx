import { useState } from "react";
import { createProject, updateProject } from "../services/project.service.js";
import { useAuth } from "../context/auth.context.jsx";

function ProjectModal({
    onClose,
    onProjectCreated,
    project = null,
    onProjectUpdated
}) {
    const [formData, setFormData] = useState({
        name: project?.name || "",
        description: project?.description || "",
        technologies: project?.technologies?.join(", ") || "",
        deadline: project?.deadline
            ? project.deadline.split("T")[0]
            : ""
    });
    const { accessToken } = useAuth();
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

        if (!formData.name.trim()) {
            setError("Project name is required");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const projectData = {
                name: formData.name,
                description: formData.description,
                technologies: formData.technologies
                    .split(",")
                    .map((technology) => technology.trim())
                    .filter(Boolean),
                deadline: formData.deadline || undefined
            };

            if (project) {
                const data = await updateProject(
                    project._id,
                    projectData,
                    accessToken
                );

                onProjectUpdated(data.project);
            } else {
                const data = await createProject(
                    projectData,
                    accessToken
                );

                onProjectCreated(data.project);
            }

            onClose();

        } catch (error) {
            console.error("Project save error:", error.message);

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
                            {project ? "Edit Project" : "Create Project"}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {project
                                ? "Update your project details."
                                : "Add a new project to your workspace."}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-4xl cursor-pointer text-gray-400 hover:text-gray-600"
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
                            Project Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your project name..."
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
                            placeholder="Describe your project..."
                            rows="4"
                            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Technologies
                        </label>

                        <input
                            type="text"
                            name="technologies"
                            value={formData.technologies}
                            onChange={handleChange}
                            placeholder="React, Express, MongoDB"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                        />

                        <p className="mt-1 text-xs text-gray-400">
                            Separate technologies with commas.
                        </p>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Deadline
                        </label>

                        <input
                            type="date"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
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
                            {loading ? "Saving..." : project ? "Save Changes" : "Create Project"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default ProjectModal;