// src/models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        age: { type: Number, required: true, min: 18, max: 100 },
        phone: {
            type: String,
            required: true,
            unique: true,
            match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        },
        password: { type: String, required: true, minlength: 6 },

        // Personal details
        gender: { type: String },
        maritalStatus: { type: String },
        educationLevel: { type: String },

        // NEW: Role for Admin Access
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },

        // Scoring & Verification Status (Single source of truth)
        crediScore: { type: Number, default: 0 },
        verificationStatus: {
            type: String,
            enum: ["not-started", "pending", "approved", "rejected"],
            default: "not-started",
        },
        adminNote: { type: String }, // Optional note from admin

        // NEW: Credit Limit & Loan Tracking Fields
        creditLimit: {
            type: Number,
            default: 0,
            min: 0,
        },
        remainingLimit: {
            type: Number,
            default: 0,
            min: 0,
        },
        activeLoansCount: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.model("User", UserSchema);
