// src/routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register user
router.post("/signup", async (req, res) => {
    const { name, age, phone, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ $or: [{ email }, { phone }] });
        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // Create new user
        user = new User({
            name,
            age,
            phone,
            email,
            password,
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user
        await user.save();

        // JWT payload
        const payload = {
            user: {
                id: user.id,
            },
        };

        // Sign token using PROMISE version
        const token = await jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE || "7d",
        });

        res.json({ token });
    } catch (err) {
        console.error("Signup error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post("/login", async (req, res) => {
    const { emailOrPhone, password } = req.body;

    try {
        // Find user by email or phone
        let user = await User.findOne({
            $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
        });

        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // JWT payload
        const payload = {
            user: {
                id: user.id,
            },
        };

        // Sign token using PROMISE version
        const token = await jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE || "7d",
        });

        res.json({ token });
    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
});

// @route   GET /api/auth/me
// @desc    Get current authenticated user
router.get("/me", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error("Get me error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
});

export default router;