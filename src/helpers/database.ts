import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true, // ⚠️ Auto-migrate. Disable in production.
    logging: true,
    entities: [User],
    migrations: ["src/migrations/**/*.ts"],
    subscribers: ["src/subscribers/**/*.ts"],
});

AppDataSource.initialize()
    .then(() => console.log("✅ Database Connected!"))
    .catch((err) => console.error("❌ Database Connection Error:", err));
