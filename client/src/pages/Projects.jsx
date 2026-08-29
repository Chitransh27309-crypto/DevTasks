import { useEffect, useState } from "react";
import { useAuth } from "../context/auth.context.jsx";
import { getProjects, deleteProject } from "../services/project.service.js";
import ProjectCard from "../components/ProjectCard.jsx";
import ProjectModal from "../components/ProjectModal.jsx";
import Loading from "../components/Loading.jsx";

function Projects() {
    const { accessToken } = useAuth();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedProject, setSelectedProject] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [deletingProject, setDeletingProject] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getProjects(accessToken);

                setProjects(data.projects);
            } catch (error) {
                console.error("Failed to fetch projects:", error.message);

                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (accessToken) {
            fetchProjects();
        }
    }, [accessToken]);

    const handleDelete = async () => {
        try {
            await deleteProject(
                deletingProject._id,
                accessToken
            );
            setProjects((prevProjects) =>
                prevProjects.filter(
                    (project) => project._id !== deletingProject._id
                )
            );
            setDeletingProject(null);

        } catch (error) {
            console.error("Delete project error:", error.message);
            alert(error.message);
        }
    };

    if (loading) {
        return <Loading />
    }
    if (error) {
        return (
            <div className="rounded-xl bg-white p-10 text-center shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">
                    Something went wrong
                </h2>

                <p className="mt-2 text-sm text-red-500">
                    {error}
                </p>

                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Projects
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your projects and tasks.
                    </p>
                </div>

                <button
                    onClick={() => {
                        setSelectedProject(null);
                        setShowModal(true);
                    }}
                    className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    + New Project
                </button>
            </div>

            {/* Projects */}
            {projects.length === 0 ? (
                <div className="rounded-xl bg-white p-10 text-center shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900">
                        No projects yet
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Create your first project to get started.
                    </p>

                    <button
                        onClick={() => {
                            setSelectedProject(null);
                            setShowModal(true);
                        }}
                        className="mt-4 cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        + Create Project
                    </button>
                </div>
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {projects.map((project) => (
                        <ProjectCard
                            key={project._id}
                            project={project}
                            onEdit={(project) => {
                                setSelectedProject(project);
                                setShowModal(true);
                            }}
                            onDelete={(project) => {
                                setDeletingProject(project);
                            }}
                        />
                    ))}
                </div>
            )}
            {showModal && (
                <ProjectModal
                    project={selectedProject}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedProject(null);
                    }}
                    onProjectCreated={(project) => {
                        setProjects((prevProjects) => [
                            project,
                            ...prevProjects
                        ]);
                    }}
                    onProjectUpdated={(updatedProject) => {
                        setProjects((prevProjects) =>
                            prevProjects.map((project) =>
                                project._id === updatedProject._id
                                    ? updatedProject
                                    : project
                            )
                        );
                    }}
                />
            )}

            {deletingProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Delete Project?
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Are you sure you want to delete{" "}
                            <span className="font-medium text-gray-700">
                                {deletingProject.name}
                            </span>
                            ?
                        </p>

                        <p className="mt-2 text-sm text-red-500">
                            This action cannot be undone.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setDeletingProject(null)}
                                className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
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

export default Projects;