import { useNavigate } from "react-router-dom";

function ProjectCard({ project, onEdit, onDelete }) {
    const navigate = useNavigate();

    const handleOpen = () => {
        navigate(`/projects/${project._id}`);
    };

    return (
        <div className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">
            <h2 className="text-lg font-semibold text-gray-900">
                {project.name}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
                {project.description || "No description"}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies?.map((technology) => (
                    <span
                        key={technology}
                        className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600"
                    >
                        {technology}
                    </span>
                ))}
            </div>

            {project.deadline && (
                <p className="mt-4 text-sm text-gray-500">
                    Deadline: {new Date(project.deadline).toLocaleDateString()}
                </p>
            )}

            <button
                onClick={handleOpen}
                className="cursor-pointer mt-5 mx-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
                Open Project
            </button>
            <button
                onClick={() => onEdit(project)}
                className="cursor-pointer mt-5 mx-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
                Edit
            </button>

            <button
                onClick={() => onDelete(project)}
                className="cursor-pointer rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
            >
                Delete
            </button>
        </div>
    );
}

export default ProjectCard;