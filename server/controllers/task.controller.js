import Task from "../models/Task.models.js";
import Project from "../models/Project.models.js";

const createTask = async (req, res) => {
    try {
        const { projectId } = req.params;

        const {
            title,
            description,
            status,
            priority,
            dueDate
        } = req.body;

        // 1. Check required field
        if (!title) {
            return res.status(400).json({
                message: "Task title is required"
            });
        }

        // 2. Check that the project belongs to the logged-in user
        const project = await Project.findOne({
            _id: projectId,
            owner: req.user
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // 3. Create task
        const task = await Task.create({
            title,
            description,
            status,
            priority,
            dueDate,
            project: projectId,
            owner: req.user
        });

        // 4. Send response
        res.status(201).json({
            message: "Task created successfully",
            task
        });

    } catch (error) {
        console.error("Create task error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getTasks = async (req, res) => {
    try {
        const { projectId } = req.params;

        // Check that the project belongs to the logged-in user
        const project = await Project.findOne({
            _id: projectId,
            owner: req.user
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Get tasks belonging to this project and user
        const tasks = await Task.find({
            project: projectId,
            owner: req.user
        }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Tasks fetched successfully",
            tasks
        });

    } catch (error) {
        console.error("Get tasks error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const updateTask = async (req, res) => {
    try {
        const { projectId, taskId } = req.params;

        const {
            title,
            description,
            status,
            priority,
            dueDate
        } = req.body;

        // 1. Check that the project belongs to the logged-in user
        const project = await Project.findOne({
            _id: projectId,
            owner: req.user
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // 2. Find the task inside this project and owned by this user
        const task = await Task.findOne({
            _id: taskId,
            project: projectId,
            owner: req.user
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // 3. Update only provided fields
        if (title !== undefined) {
            task.title = title;
        }

        if (description !== undefined) {
            task.description = description;
        }

        if (status !== undefined) {
            task.status = status;
        }

        if (priority !== undefined) {
            task.priority = priority;
        }

        if (dueDate !== undefined) {
            task.dueDate = dueDate;
        }

        // 4. Save changes
        await task.save();

        res.status(200).json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {
        console.error("Update task error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { projectId, taskId } = req.params;

        // Check project ownership
        const project = await Project.findOne({
            _id: projectId,
            owner: req.user
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Delete only if task belongs to this project and user
        const task = await Task.findOneAndDelete({
            _id: taskId,
            project: projectId,
            owner: req.user
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        console.error("Delete task error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

export default createTask;
export { getTasks, updateTask, deleteTask }