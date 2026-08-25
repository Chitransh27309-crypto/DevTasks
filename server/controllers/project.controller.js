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

export default createProject;