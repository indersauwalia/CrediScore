// src/models/Income.js
import mongoose from "mongoose";

const IncomeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
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

        // Verification details
        pan: { type: String, match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/ },
        bankAccountNo: { type: String },
        ifsc: { type: String, match: /^[A-Z]{4}0[A-Z0-9]{6}$/ },

        // Proof document
        proofFileId: { type: mongoose.Schema.Types.ObjectId },
        proofFilename: { type: String },
    },
    { timestamps: true }
);

export const Income = mongoose.model("Income", IncomeSchema);