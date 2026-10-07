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

        if (!title) {
            return res.status(400).json({
                message: "Task title is required"
            });
        }

        const project = await Project.findOne({
            _id: projectId,
            owner: req.user
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        const task = await Task.create({
            title,
            description,
            status,
            priority,
            dueDate,
            project: projectId,
            owner: req.user
        });

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

        const { status, priority, search, sort = "createdAt", order = "desc" } = req.query;

        const project = await Project.findOne({
            _id: projectId,
            owner: req.user
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Base filter
        const filter = {
            project: projectId,
            owner: req.user
        };

        // Filter by status
        if (status) {
            filter.status = status;
        }

        // Filter by priority
        if (priority) {
            filter.priority = priority;
        }

        // Search by title or description
        if (search) {
            filter.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        const allowedSortFields = [
            "createdAt",
            "dueDate",
            "priority",
            "title"
        ];

        const sortField = allowedSortFields.includes(sort) ? sort : "createdAt";

        const sortOrder = order === "asc" ? 1 : -1;

        const tasks = await Task.find(filter).sort({
            [sortField]: sortOrder
        });

        res.status(200).json({
            message: "Tasks fetched successfully",
            count: tasks.length,
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

        const project = await Project.findOne({
            _id: projectId,
            owner: req.user
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

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

        // Update only provided fields
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

        const project = await Project.findOne({
            _id: projectId,
            owner: req.user
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

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