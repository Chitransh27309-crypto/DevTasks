import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js';
import cookieParser from "cookie-parser";
import authRoutes from './routes/auth.route.js';
import projectRoutes from "./routes/project.route.js";
import taskRoutes from "./routes/task.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import cors from "cors";

dotenv.config()

const app = express();

connectDb()

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true
    })
);

app.use(express.json())
app.use(cookieParser());

// routes
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/projects/:projectId/tasks", taskRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
    res.send("DevTask API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});