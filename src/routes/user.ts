import { Router, RequestHandler } from "express";
import { createUser, findByEmail } from "../helpers/userRepository";

const router = Router();

interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

// Create User
const registerHandler: RequestHandler = async (req, res): Promise<void> => {
    try {
        const { username, email, password } = req.body as RegisterRequest;

        // Validate input
        if (!username || !email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        // Check if user already exists
        const existingUser = await findByEmail(email);
        if (existingUser) {
            res.status(400).json({ message: "User with this email already exists" });
            return;
        }

        // Create new user
        const user = await createUser(username, email, password);
        
        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        
        res.status(201).json({ 
            message: "User registered successfully", 
            user: userWithoutPassword 
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Error registering user" });
    }
};

// Find User by Email
const getUserHandler: RequestHandler = async (req, res): Promise<void> => {
    try {
        const { email } = req.params;
        const user = await findByEmail(email);
        
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).json({ message: "Error retrieving user" });
    }
};

router.post("/register", registerHandler);
router.get("/user/:email", getUserHandler);

export default router;
