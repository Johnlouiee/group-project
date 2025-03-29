import { Router, Request, Response, NextFunction, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { DatabaseHelper } from "../helpers/database";

const router = Router();

interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}


const registerHandler: RequestHandler = async (
    req: Request<{}, {}, RegisterRequest>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            res.status(StatusCodes.BAD_REQUEST).json({ 
                error: "Please provide all the required parameters..." 
            });
            return;
        }
        
        const existingUser = await DatabaseHelper.findByEmail(email);
        
        if (existingUser) {
            res.status(StatusCodes.BAD_REQUEST).json({ 
                error: "This email has already been registered..." 
            });
            return;
        }
        
        const newUser = await DatabaseHelper.createUser({
            username,
            email,
            password
        });
        
        res.status(StatusCodes.CREATED).json(newUser);
    } catch (error) {
        next(error);
    }
};

router.post("/register", registerHandler);

export default router;