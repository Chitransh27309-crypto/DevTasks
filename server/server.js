import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js';
import authRoutes from './routes/auth.route.js';

dotenv.config()

const app = express();

connectDb()

app.use(express.json())

// routes
app.use("/api/v1/auth",authRoutes)

app.get("/", (req, res) => {
    res.send("DevTask API is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});