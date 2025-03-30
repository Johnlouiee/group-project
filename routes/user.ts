import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { DatabaseHelper } from "../helpers/database";

const router = express.Router();

// Delete user endpoint
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        // Extract and validate user ID
        const userId = parseInt(req.params.id, 10);

        if (isNaN(userId) || userId <= 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                error: "Invalid user ID. Must be a positive number" 
            });
        }

        // Check if user exists
        const user = await DatabaseHelper.findById(userId);
        
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ 
                error: `User with ID ${userId} not found` 
            });
        }

        // Attempt to delete user
        const deleted = await DatabaseHelper.deleteUser(userId);
        
        if (!deleted) {
            throw new Error("Deletion operation returned false");
        }

        return res.status(StatusCodes.OK).json({ 
            message: `User with ID ${userId} deleted successfully` 
        });

    } catch (error) {
        // Type the error for better handling
        const err = error instanceof Error ? error : new Error(String(error));
        
        console.error('Delete user error:', {
            message: err.message,
            stack: err.stack,
            userId: req.params.id
        });

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            error: "Failed to delete user due to server error",
            // Optionally include error message in development
            ...(process.env.NODE_ENV === 'development' && { details: err.message })
        });
    }
});

export default router; // Add this if you're using module exports