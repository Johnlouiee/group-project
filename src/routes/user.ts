import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { DatabaseHelper } from "../helpers/database";

const router = express.Router(); 

router.post("/users", async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: "Please provide all the required parameters...",
            });
        }

        // Check if user exists
        const existingUser = await DatabaseHelper.findByEmail(email);

        if (existingUser) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: "This email has already been registered...",
            });
        }

        // Create new user
        const newUser = await DatabaseHelper.createUser({
            username,
            email,
            password,
        });

        return res.status(StatusCodes.CREATED).json(newUser);
    } catch (error) {
        console.error("User creation error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Internal server error",
        });
    }
});

export default router; // ✅ Ensure you're exporting `router`
