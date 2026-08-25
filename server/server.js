import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js';
import cookieParser from "cookie-parser";
import authRoutes from './routes/auth.route.js';
import projectRoutes from "./routes/project.route.js";
import taskRoutes from "./routes/task.route.js"

dotenv.config()

const app = express();

connectDb()

app.use(express.json())
app.use(cookieParser());

// routes
app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/projects/:projectId/tasks", taskRoutes);

app.get("/", (req, res) => {
    res.send("DevTask API is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});