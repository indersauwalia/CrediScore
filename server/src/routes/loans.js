import express from "express";
import auth from "../middleware/auth.js";
import { PendingLoanRequests } from "../models/PendingLoanRequests.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/apply", auth, async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const { loanType, requestedAmount, tenure, interestRate, processingFee } = req.body;

        if (user.verificationStatus?.toLowerCase() !== "approved") {
            return res.status(400).json({ msg: "Income verification pending or not approved" });
        }

        if (requestedAmount > user.remainingLimit) {
            return res.status(400).json({ msg: "Requested amount exceeds remaining credit limit" });
        }

        if (requestedAmount < 1000) {
            return res.status(400).json({ msg: "Minimum loan amount is ₹1,000" });
        }

        const pendingRequest = await PendingLoanRequests.create({
            user: userId,
            loanType,
            requestedAmount,
            tenure,
            interestRate,
            processingFee,
            requestStatus: "pending",
        });

        res.json({
            msg: "Loan application submitted successfully! It is now pending admin review.",
            requestId: pendingRequest._id,
        });
    } catch (err) {
        console.error("Loan apply error:", err);
        res.status(500).json({ msg: "Server error" });
    }
});

router.get("/my-requests", auth, async (req, res) => {
    try {
        const requests = await PendingLoanRequests.find({ user: req.user.id });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

export default router;
