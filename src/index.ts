import "reflect-metadata";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user";
import { AppDataSource } from "./helpers/database";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", userRoutes);

// Initialize database and start server
const startServer = async () => {
    try {
        await AppDataSource.initialize();
        console.log("✅ Database Connected!");

        app.listen(port, () => {
            console.log(`🚀 Server running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error("❌ Error starting server:", error);
        process.exit(1);
    }
};

startServer();
