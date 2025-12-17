// src/routes/credit.js
import express from "express";
import { Profile } from "../models/Income.js";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Sample verified beneficiary KYC data
const verifiedBeneficiaries = [
    { aadhaar: "123456789012", pan: "ABCDE1234F" },
    { aadhaar: "987654321098", pan: "FGHIJ5678K" },
    { aadhaar: "555566667777", pan: "XYZAB9999Z" },
];

// Scoring logic
const calculateCrediScore = (profile) => {
    let score = 300;

    const surplus = profile.monthlyIncome - profile.monthlyExpense - profile.existingEmi;
    if (surplus >= 30000) score += 250;
    else if (surplus >= 20000) score += 200;
    else if (surplus >= 10000) score += 150;
    else if (surplus >= 5000) score += 100;
    else if (surplus > 0) score += 50;

    if (profile.currentExpYears >= 5) score += 100;
    else if (profile.currentExpYears >= 3) score += 80;
    else if (profile.currentExpYears >= 1) score += 40;

    if (profile.totalExpYears >= 10) score += 80;
    else if (profile.totalExpYears >= 5) score += 50;

    if (profile.employmentType === "salaried") score += 60;
    else if (profile.employmentType === "business") score += 80;

    if (profile.residenceType === "owned") score += 120;
    else if (profile.residenceType === "family") score += 70;

    if (profile.dependents <= 1) score += 60;
    else if (profile.dependents <= 3) score += 30;

    const cardUtilRatio = profile.creditCardSpend / profile.monthlyIncome;
    if (cardUtilRatio < 0.2) score += 70;
    else if (cardUtilRatio < 0.4) score += 40;

    return Math.min(score, 900);
};

// POST /api/credit/submit-profile
router.post("/submit-profile", auth, async (req, res) => {
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
            aadhaar,
            pan,
            gender,
            maritalStatus,
            educationLevel,
        } = req.body;

        // 1. KYC Matching
        const kycMatch = verifiedBeneficiaries.some((v) => v.aadhaar === aadhaar && v.pan === pan);

        if (!kycMatch) {
            return res.status(400).json({
                msg: "Aadhaar and PAN do not match verified beneficiary records. Cannot generate CrediScore.",
            });
        }

        // 2. Save/Update Financial Profile
        const profileFields = {
            user: userId,
            monthlyIncome,
            monthlyExpense,
            employmentType,
            designation,
            totalExpYears,
            currentExpYears,
            dependents,
            residenceType,
            existingEmi: existingEmi || 0,
            creditCardSpend: creditCardSpend || 0,
            kycMatched: true,
        };

        let profile = await Profile.findOneAndUpdate({ user: userId }, profileFields, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        });

        // 3. Calculate CrediScore
        const crediScore = calculateCrediScore(profile);
        profile.crediScore = crediScore;
        await profile.save();

        // 4. Update User model with personal details & score
        await User.findByIdAndUpdate(userId, {
            aadhaar,
            pan,
            gender,
            maritalStatus,
            educationLevel,
            crediScore,
        });

        res.json({
            msg: "Credit profile submitted successfully!",
            crediScore,
            kycMatched: true,
        });
    } catch (err) {
        console.error("Credit submit error:", err);
        res.status(500).json({ msg: "Server error. Please try again." });
    }
});

export default router;