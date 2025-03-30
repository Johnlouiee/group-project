import { Router, RequestHandler } from "express";
import { createUser, findByEmail, deleteUser } from "../helpers/userRepository"; // Added deleteUser import

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

        if (!username || !email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        const existingUser = await findByEmail(email);
        if (existingUser) {
            res.status(400).json({ message: "User with this email already exists" });
            return;
        }

        const user = await createUser(username, email, password);
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

        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).json({ message: "Error retrieving user" });
    }
};

// Delete User by Email
const deleteUserHandler: RequestHandler = async (req, res): Promise<void> => {
    try {
        const { email } = req.params;
        
        const user = await findByEmail(email);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        await deleteUser(email);
        res.status(200).json({ 
            message: "User deleted successfully",
            email: email 
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user" });
    }
};

router.post("/register", registerHandler);
router.get("/user/:email", getUserHandler);
router.delete("/user/:email", deleteUserHandler); // Added DELETE route

export default router;