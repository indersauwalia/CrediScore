import express from "express";
import { Income } from "../models/Income.js";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

const calculateCrediScore = (income) => {
    let score = 300; 
    const surplus = income.monthlyIncome - income.monthlyExpense - (income.existingEmi || 0);

    if (surplus >= 30000) score += 250;
    else if (surplus >= 20000) score += 200;
    else if (surplus >= 10000) score += 150;
    else if (surplus >= 5000) score += 100;
    else if (surplus > 0) score += 50;

    if (income.currentExpYears >= 5) score += 100;
    else if (income.currentExpYears >= 3) score += 80;
    else if (income.currentExpYears >= 1) score += 40;
    if (income.totalExpYears >= 10) score += 80;
    else if (income.totalExpYears >= 5) score += 50;

    if (income.employmentType === "salaried") score += 60;
    else if (income.employmentType === "business" || income.employmentType === "self-employed")
        score += 80;
    else if (income.employmentType === "freelancer") score += 40;

    if (income.residenceType === "owned") score += 120;
    else if (income.residenceType === "family") score += 70;

    if (income.dependents <= 1) score += 60;
    else if (income.dependents <= 3) score += 30;

    const cardUtilRatio =
        income.monthlyIncome > 0 ? income.creditCardSpend / income.monthlyIncome : 0;
    if (cardUtilRatio < 0.2) score += 70;
    else if (cardUtilRatio < 0.4) score += 40;

    return Math.min(score, 900);
};

const calculateCreditLimit = (crediScore) => {
    if (crediScore >= 750) return 400000;
    if (crediScore >= 700) return 250000;
    if (crediScore >= 650) return 150000;
    if (crediScore >= 600) return 100000;
    return 50000;
};


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

        if (!monthlyIncome || monthlyIncome <= 0) {
            return res
                .status(400)
                .json({ msg: "Monthly income is required and must be positive." });
        }

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

        let income = await Income.findOneAndUpdate({ user: userId }, incomeFields, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        });

        const crediScore = calculateCrediScore(income);

        const creditLimit = calculateCreditLimit(crediScore);
        const remainingLimit = creditLimit;

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

router.get("/stats", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        const income = await Income.findOne({ user: userId });
        const { PendingLoanRequests } = await import("../models/PendingLoanRequests.js");
        const loans = await PendingLoanRequests.find({ user: userId });

        if (!income) {
            return res.json({
                hasProfile: false,
                crediScore: user.crediScore,
                riskLevel: "Unknown",
                breakdown: [],
                insights: ["Complete your income profile to unlock insights."]
            });
        }

        const breakdown = [];
        const surplus = income.monthlyIncome - income.monthlyExpense - (income.existingEmi || 0);
        let surplusPoints = surplus >= 30000 ? 250 : surplus >= 10000 ? 150 : surplus > 0 ? 50 : 0;
        breakdown.push({ factor: "Income Stability", score: surplusPoints, status: surplusPoints >= 150 ? "Good" : "Average" });

        let expPoints = income.currentExpYears >= 5 ? 100 : income.currentExpYears >= 1 ? 40 : 0;
        breakdown.push({ factor: "Work Experience", score: expPoints, status: expPoints >= 80 ? "Good" : "Average" });

        const cardUtilRatio = income.monthlyIncome > 0 ? income.creditCardSpend / income.monthlyIncome : 0;
        let utilPoints = cardUtilRatio < 0.2 ? 70 : cardUtilRatio < 0.4 ? 40 : 0;
        breakdown.push({ factor: "Credit Utilization", score: utilPoints, status: utilPoints >= 70 ? "Good" : "Average" });

        const activeLoans = loans.filter(l => l.requestStatus === "approved");
        let loanImpact = activeLoans.length > 0 ? -30 * activeLoans.length : 0;
        breakdown.push({ factor: "Existing Loans", score: loanImpact, status: activeLoans.length === 0 ? "Excellent" : "Average" });

        let riskLevel = "High Risk";
        let riskColor = "rose";
        if (user.crediScore >= 750) { riskLevel = "Low Risk"; riskColor = "emerald"; }
        else if (user.crediScore >= 650) { riskLevel = "Medium Risk"; riskColor = "amber"; }

        const eligibility = {
            maxAmount: user.creditLimit,
            recommendedType: user.crediScore >= 750 ? "Personal Loan" : "Salary Advance",
            interestRange: user.crediScore >= 750 ? "10.5% - 12%" : "12% - 15%"
        };

        const insights = [];
        if (cardUtilRatio > 0.3) insights.push("Reducing debt ratio can improve your score.");
        if (income.monthlyExpense > income.monthlyIncome * 0.6) insights.push("Expenses are high compared to income.");
        if (user.crediScore >= 750) insights.push("You are eligible for better interest rates.");

        const formattedLoans = loans.map(l => {
            const monthlyRate = l.interestRate / 12 / 100;
            const emi = l.requestStatus === "approved" ? 
                Math.round((l.requestedAmount * monthlyRate * Math.pow(1 + monthlyRate, l.tenure)) / (Math.pow(1 + monthlyRate, l.tenure) - 1)) : 0;
            
            let progress = 0;
            let monthsCompleted = 0;
            if (l.disbursedAt) {
                const diffTime = Math.abs(new Date() - new Date(l.disbursedAt));
                monthsCompleted = Math.min(l.tenure, Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30)));
                progress = Math.round((monthsCompleted / l.tenure) * 100);
            }

            return {
                ...l.toObject(),
                emi,
                progress,
                monthsCompleted,
                nextDueDate: l.requestStatus === "approved" ? "5th of Next Month" : null
            };
        });

        res.json({
            hasProfile: true,
            crediScore: user.crediScore,
            riskLevel,
            riskColor,
            breakdown,
            eligibility,
            insights,
            loans: formattedLoans
        });
    } catch (err) {
        console.error("Stats error:", err);
        res.status(500).json({ msg: "Server error." });
    }
});

export default router;