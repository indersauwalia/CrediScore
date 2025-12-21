import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { Income } from "../models/Income.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
    const { name, age, phone, email, password } = req.body;
    try {
        let user = await User.findOne({ $or: [{ email }, { phone }] });
        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }

        user = new User({ name, age, phone, email, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user.id } };

        const token = await jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE || "7d",
        });

        res.json({ token });
    } catch (err) {
        console.error("Signup error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
});

router.post("/login", async (req, res) => {
    const { emailOrPhone, password } = req.body;
    try {
        let user = await User.findOne({
            $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
        });

        if (!user) return res.status(400).json({ msg: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const payload = { user: { id: user.id } };

        const token = await jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE || "7d",
        });

        res.json({ token });
    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
});


router.get("/me", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const income = await Income.findOne({ user: req.user.id });

        res.json({
            ...user.toObject(),
            income: income || null, 
        });
    } catch (err) {
        console.error("Get me error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
});

export default router;
