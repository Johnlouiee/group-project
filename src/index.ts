import "reflect-metadata";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user";
import { AppDataSource } from "./helpers/database";

const app = express();
const port = process.env.PORT || 3000;

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// CORS middleware with detailed configuration
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
    credentials: true,
    maxAge: 86400 // 24 hours
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers middleware
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

// Basic route for testing
app.get("/", (req, res) => {
    res.json({ 
        message: "API is running",
        status: "success",
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Routes
app.use("/api", userRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(`Error: ${err.message}`);
    console.error(err.stack);
    
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Something went wrong!",
        data: null,
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        data: null,
        timestamp: new Date().toISOString()
    });
});

// Initialize database and start server
const startServer = async () => {
    try {
        await AppDataSource.initialize();
        console.log("✅ Database Connected!");

        app.listen(port, () => {
            console.log(`🚀 Server running on http://localhost:${port}`);
            console.log(`📝 Available endpoints:`);
            console.log(`   - GET    http://localhost:${port}/`);
            console.log(`   - GET    http://localhost:${port}/health`);
            console.log(`   - GET    http://localhost:${port}/api/users`);
            console.log(`   - POST   http://localhost:${port}/api/register`);
            console.log(`   - GET    http://localhost:${port}/api/user/:email`);
            console.log(`   - DELETE http://localhost:${port}/api/user/:email`);
        });
    } catch (error) {
        console.error("❌ Error starting server:", error);
        process.exit(1);
    }
};

startServer();
