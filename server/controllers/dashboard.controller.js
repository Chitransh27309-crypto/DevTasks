import Project from "../models/Project.models.js";
import Task from "../models/Task.models.js";

const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user;

        // Count user's projects
        const totalProjects = await Project.countDocuments({
            owner: userId
        });

        // Count user's tasks by status
        const taskStats = await Task.aggregate([
            {
                $match: {
                    owner: userId
                }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        let totalTasks = 0;
        let completedTasks = 0;
        let inProgressTasks = 0;
        let todoTasks = 0;

        taskStats.forEach((item) => {
            totalTasks += item.count;

            if (item._id === "completed") {
                completedTasks = item.count;
            }

            if (item._id === "in-progress") {
                inProgressTasks = item.count;
            }

            if (item._id === "todo") {
                todoTasks = item.count;
            }
        });

        const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

        res.status(200).json({
            message: "Dashboard stats fetched successfully",
            stats: {
                totalProjects,
                totalTasks,
                completedTasks,
                inProgressTasks,
                todoTasks,
                completionPercentage
            }
        });

    } catch (error) {
        console.error("Dashboard stats error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

export default getDashboardStats;