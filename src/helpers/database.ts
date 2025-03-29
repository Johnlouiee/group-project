import mysql from 'mysql2/promise';
import * as bcrypt from 'bcrypt';

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'user_auth_db'
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// User interface
export interface User {
    id?: number;
    username: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Database helper class
export class DatabaseHelper {
    // Initialize database and create tables
    static async initialize() {
        try {
            const connection = await pool.getConnection();
            await connection.query(`
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            `);
            connection.release();
            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Database initialization error:', error);
            throw error;
        }
    }

    // Create new user
    static async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
        try {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            const [result] = await pool.query(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                [user.username, user.email, hashedPassword]
            );
            const [newUser] = await pool.query(
                'SELECT id, username, email, createdAt, updatedAt FROM users WHERE id = ?',
                [(result as any).insertId]
            );
            return (newUser as any[])[0];
        } catch (error) {
            console.error('Create user error:', error);
            throw error;
        }
    }

    // Find user by email
    static async findByEmail(email: string): Promise<User | null> {
        try {
            const [users] = await pool.query(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
            return (users as any[])[0] || null;
        } catch (error) {
            console.error('Find user error:', error);
            throw error;
        }
    }

    // Verify password
    static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
} 