// src/models/Profile.js
import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        monthlyIncome: { type: Number, required: true },
        monthlyExpense: { type: Number, required: true },
        employmentType: { type: String, required: true },
        designation: { type: String },
        totalExpYears: { type: Number, required: true },
        currentExpYears: { type: Number, required: true },
        dependents: { type: Number, required: true },
        residenceType: { type: String, required: true },
        existingEmi: { type: Number, default: 0 },
        creditCardSpend: { type: Number, default: 0 },
        kycMatched: { type: Boolean, default: false },
        crediScore: { type: Number, default: 300 }, // Calculated here
    },
    { timestamps: true }
);

export const Profile = mongoose.model("Income", ProfileSchema);