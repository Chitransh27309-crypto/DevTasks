import Project from "../models/Project.models.js";

const createProject = async (req, res) => {
    try {
        const {
            name,
            description,
            technologies,
            deadline
        } = req.body;

        // 1. Validate required field
        if (!name) {
            return res.status(400).json({
                message: "Project name is required"
            });
        }

        // 2. Create project
        const project = await Project.create({
            name,
            description,
            technologies,
            deadline,
            owner: req.user
        });

        // 3. Send response
        res.status(201).json({
            message: "Project created successfully",
            project
        });

    } catch (error) {
        console.error("Create project error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            owner: req.user
        }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Projects fetched successfully",
            projects
        });

    } catch (error) {
        console.error("Get projects error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findOne({
            _id: id,
            owner: req.user
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.status(200).json({
            message: "Project fetched successfully",
            project
        });

    } catch (error) {
        console.error("Get project error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            technologies,
            deadline
        } = req.body;

        const project = await Project.findOne({
            _id: id,
            owner: req.user
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Update only the fields that were provided
        if (name !== undefined) {
            project.name = name;
        }

        if (description !== undefined) {
            project.description = description;
        }

        if (technologies !== undefined) {
            project.technologies = technologies;
        }

        if (deadline !== undefined) {
            project.deadline = deadline;
        }

        await project.save();

        res.status(200).json({
            message: "Project updated successfully",
            project
        });

    } catch (error) {
        console.error("Update project error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findOneAndDelete({
            _id: id,
            owner: req.user
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.status(200).json({
            message: "Project deleted successfully"
        });

    } catch (error) {
        console.error("Delete project error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


export default createProject;
export { getProjects, getProjectById, updateProject, deleteProject };