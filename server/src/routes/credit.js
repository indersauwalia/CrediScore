// src/routes/credit.js
import express from "express";
import { Income } from "../models/Income.js";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Simple scoring logic (income-first model)
const calculateCrediScore = (income) => {
    let score = 300; // Base score
    const surplus = income.monthlyIncome - income.monthlyExpense - (income.existingEmi || 0);

    // Surplus income (key for repayment capacity)
    if (surplus >= 30000) score += 250;
    else if (surplus >= 20000) score += 200;
    else if (surplus >= 10000) score += 150;
    else if (surplus >= 5000) score += 100;
    else if (surplus > 0) score += 50;

    // Job stability
    if (income.currentExpYears >= 5) score += 100;
    else if (income.currentExpYears >= 3) score += 80;
    else if (income.currentExpYears >= 1) score += 40;
    if (income.totalExpYears >= 10) score += 80;
    else if (income.totalExpYears >= 5) score += 50;

    // Employment type
    if (income.employmentType === "salaried") score += 60;
    else if (income.employmentType === "business" || income.employmentType === "self-employed")
        score += 80;
    else if (income.employmentType === "freelancer") score += 40;

    // Residence stability
    if (income.residenceType === "owned") score += 120;
    else if (income.residenceType === "family") score += 70;

    // Dependents
    if (income.dependents <= 1) score += 60;
    else if (income.dependents <= 3) score += 30;

    // Credit card behavior
    const cardUtilRatio =
        income.monthlyIncome > 0 ? income.creditCardSpend / income.monthlyIncome : 0;
    if (cardUtilRatio < 0.2) score += 70;
    else if (cardUtilRatio < 0.4) score += 40;

    return Math.min(score, 900); // Max 900
};

// Calculate credit limit based on CrediScore (matches Dashboard)
const calculateCreditLimit = (crediScore) => {
    if (crediScore >= 750) return 400000;
    if (crediScore >= 700) return 250000;
    if (crediScore >= 650) return 150000;
    if (crediScore >= 600) return 100000;
    return 50000;
};

// POST /api/credit/submit-income
// Submit or update income profile → calculate CrediScore → set credit limit → trigger verification
router.post("/submit-income", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            monthlyIncome,
            monthlyExpense,
            employmentType,
            designation,
            totalExpYears,
            currentExpYears,
            dependents,
            residenceType,
            existingEmi,
            creditCardSpend,
            gender,
            maritalStatus,
            educationLevel,
        } = req.body;

        // Validate required fields
        if (!monthlyIncome || monthlyIncome <= 0) {
            return res
                .status(400)
                .json({ msg: "Monthly income is required and must be positive." });
        }

        // Prepare income data
        const incomeFields = {
            user: userId,
            monthlyIncome,
            monthlyExpense: monthlyExpense || 0,
            employmentType: employmentType || "salaried",
            designation: designation || "",
            totalExpYears: totalExpYears || 0,
            currentExpYears: currentExpYears || 0,
            dependents: dependents || 0,
            residenceType: residenceType || "rented",
            existingEmi: existingEmi || 0,
            creditCardSpend: creditCardSpend || 0,
        };

        // Upsert Income document
        let income = await Income.findOneAndUpdate({ user: userId }, incomeFields, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        });

        // Calculate new CrediScore
        const crediScore = calculateCrediScore(income);

        // Calculate credit limit
        const creditLimit = calculateCreditLimit(crediScore);
        const remainingLimit = creditLimit;

        // Update User
        const userUpdate = {
            crediScore,
            creditLimit,
            remainingLimit,
            verificationStatus: "not-started",
            activeLoansCount: 0,
        };

        if (gender !== undefined) userUpdate.gender = gender;
        if (maritalStatus !== undefined) userUpdate.maritalStatus = maritalStatus;
        if (educationLevel !== undefined) userUpdate.educationLevel = educationLevel;

        await User.findByIdAndUpdate(userId, userUpdate);

        res.json({
            msg: income.isNew
                ? "Income profile created! CrediScore generated."
                : "Income profile updated! CrediScore and credit limit recalculated.",
            crediScore,
            creditLimit,
            remainingLimit,
            verificationStatus: "not-started",
        });
    } catch (err) {
        console.error("Submit income error:", err);
        res.status(500).json({ msg: "Server error." });
    }
});

export default router;