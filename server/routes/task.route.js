import express from "express";

import protect from "../middleware/auth.middleware.js";
import createTask, { getTasks, updateTask, deleteTask } from "../controllers/task.controller.js";

const router = express.Router({ mergeParams: true });

router.post("/", protect, createTask);
router.get("/", protect, getTasks);
router.put("/:taskId", protect, updateTask);
router.delete("/:taskId", protect, deleteTask);

export default router;