import express, { RequestHandler } from "express"
import { StatusCodes } from "http-status-codes"
import { DatabaseHelper } from "../helpers/database"

const router = express.Router()

const register: RequestHandler = async (req, res) => {
    try {
    const { username, email, password } = req.body
    
    if (!username || !email || !password) {
    res.status(StatusCodes.BAD_REQUEST).json({error : "Please provide all the required parameters..."})
    return
    }
    
    // Check if user exists
    const existingUser = await DatabaseHelper.findByEmail(email)
    
    if (existingUser) {
    res.status(StatusCodes.BAD_REQUEST).json({error : "This email has already been registered..."})
    return
    }
    
    // Create new user
    const newUser = await DatabaseHelper.createUser({
    username,
    email,
    password
    })
    
    res.status(StatusCodes.CREATED).json(newUser)
    } catch (error) {
    console.error('Registration error:', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : "Internal server error"})
    }
}

const login: RequestHandler = async (req, res) => {
    try {
    const { email, password } = req.body
    
    if (!email || !password) {
    res.status(StatusCodes.BAD_REQUEST).json({error : "Please provide all the required parameters..."})
    return
    }
    
    // Find user
    const user = await DatabaseHelper.findByEmail(email)
    
    if (!user) {
    res.status(StatusCodes.NOT_FOUND).json({error : "No user exists with the email provided..."})
    return
    }
    
    // Compare password
    const isValidPassword = await DatabaseHelper.verifyPassword(password, user.password)
    
    if (!isValidPassword) {
    res.status(StatusCodes.BAD_REQUEST).json({error : "Incorrect Password!"})
    return
    }
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user
    res.status(StatusCodes.OK).json(userWithoutPassword)
    } catch (error) {
    console.error('Login error:', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : "Internal server error"})
    }
}

router.post("/register", register)
router.post("/login", login)

export default router