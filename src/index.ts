import express from "express";
import userRoutes from "./routes/user";
import { DatabaseHelper } from "./helpers/database";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

// Initialize database and start server
async function startServer() {
    try {
        await DatabaseHelper.initialize();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();