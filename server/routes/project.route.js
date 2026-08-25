import express from "express";

import protect from "../middleware/auth.middleware.js";
import createProject, { getProjects, getProjectById, updateProject, deleteProject } from "../controllers/project.controller.js";

const router = express.Router();

router.post("/", protect, createProject);
router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectById);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

export default router;