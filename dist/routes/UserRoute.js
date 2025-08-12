import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import UserModul from "../model/User.js";
import jwt from "jsonwebtoken";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
const route = express.Router();
const JWT_SECRET = process.env.JWT_SCRECT;
route.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Zod validation
        const userschema = z.object({
            username: z.string().min(3).max(30),
            email: z.string().email("Please provide a valid email"),
            password: z.string().min(8).max(15),
        });
        const validation = userschema.safeParse({
            username,
            email,
            password
        });
        if (!validation.success) {
            res.status(400).json({
                message: "Validation failed",
                errors: validation.error
            });
            return;
        }
        // Check if user exists  
        const existingUser = await UserModul.findOne({
            $or: [{ username }, { email }]
        });
        if (existingUser) {
            res.status(409).json({
                message: "User already exists"
            });
            return;
        }
        // Hash password 
        const hashedpassword = await bcrypt.hash(password, 10);
        // Create user
        const CreateUser = await UserModul.create({
            username,
            email,
            password: hashedpassword
        });
        res.status(201).json({
            message: "User created successfully",
            userId: CreateUser._id.toString(),
            user: {
                username: CreateUser.username,
                email: CreateUser.email
            }
        });
    }
    catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
route.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        if (!email || !password) {
            return res.status(400).json({
                msg: "Email and password are required"
            });
        }
        const checkuser = await UserModul.findOne({ email });
        if (!checkuser) {
            res.status(403).json({
                msg: "Invalid credentials"
            });
            return;
        }
        const passwordmatch = await bcrypt.compare(password, checkuser.password);
        if (passwordmatch) {
            if (!JWT_SECRET) {
                throw new Error("JWT_SECRET is not defined");
            }
            const token = jwt.sign({
                id: checkuser._id
            }, JWT_SECRET, { expiresIn: "1d" });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 1 * 24 * 60 * 60 * 1000
            });
            res.status(200).json({
                msg: "Signin successful",
                token: token,
                userId: checkuser._id
            });
        }
        else {
            res.status(403).json({
                msg: "Invalid credentials"
            });
            return;
        }
    }
    catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
route.post("/logout", AuthMiddleware, (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        res.status(200).json({
            msg: "Logged out successfully"
        });
    }
    catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            msg: "Internal server error"
        });
    }
});
export default route;
