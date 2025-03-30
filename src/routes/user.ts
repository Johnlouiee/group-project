import { Router, Request, Response } from "express";
import { createUser, findByEmail, deleteUser, listUsers, findById } from "../helpers/userRepository";

const router = Router();

// Register User
router.post("/register", async (req: Request, res: Response) => {
    try {
        // Check if body is empty
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: "Request body is empty"
            });
        }

        const { title, firstName, lastName, role, email, password, confirmPassword } = req.body;

        // Validate input
        if (!title || !firstName || !lastName || !role || !email || !password || !confirmPassword) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Validate password confirmation
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }

        // Check if user exists
        const existingUser = await findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists"
            });
        }

        // Create user
        await createUser(
            title,
            firstName,
            lastName,
            role,
            email,
            password
        );
        
        return res.status(201).json({
            message: "User created"
        });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({
            message: "Error creating user"
        });
    }
});

// List all users
router.get("/users", async (req: Request, res: Response) => {
    try {
        const users = await listUsers();
        if (!users || users.length === 0) {
            return res.status(404).json({
                message: "No users found"
            });
        }
        const usersWithoutPasswords = users.map(({ password, ...user }) => user);
        return res.status(200).json(usersWithoutPasswords);
    } catch (error) {
        console.error("Error listing users:", error);
        return res.status(500).json({
            message: "Error retrieving users"
        });
    }
});

// Get User by Email
router.get("/user/:email", async (req: Request, res: Response) => {
    try {
        const { email } = req.params;
        const user = await findByEmail(email);
        
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
    } catch (error) {
        console.error("Error retrieving user:", error);
        return res.status(500).json({
            message: "Error retrieving user"
        });
    }
});

// Get User by ID
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid ID format"
            });
        }

        const user = await findById(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
    } catch (error) {
        console.error("Error retrieving user:", error);
        return res.status(500).json({
            message: "Error retrieving user"
        });
    }
});

// Delete User
router.delete("/user/:email", async (req: Request, res: Response) => {
    try {
        const { email } = req.params;
        
        const user = await findByEmail(email);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        await deleteUser(email);
        return res.status(200).json({
            message: "User deleted"
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({
            message: "Error deleting user"
        });
    }
});

export default router;