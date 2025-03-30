import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "user_auth_db",
    synchronize: true, // ⚠️ Auto-migrate. Disable in production.
    logging: true,
    entities: [User],
    migrations: ["src/migrations/**/*.ts"],
    subscribers: ["src/subscribers/**/*.ts"],
});

AppDataSource.initialize()
    .then(() => console.log("✅ Database Connected!"))
    .catch((err) => console.error("❌ Database Connection Error:", err));
