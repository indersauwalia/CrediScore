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
        aadhaar: { type: String, unique: true, sparse: true }, // Optional until profile
        pan: { type: String, unique: true, sparse: true },
        gender: { type: String },
        maritalStatus: { type: String },
        educationLevel: { type: String },
        crediScore: { type: Number, default: 0 }, // Will update from Profile
        incomeVerified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model("User", UserSchema);