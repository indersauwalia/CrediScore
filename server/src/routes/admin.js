// src/routes/admin.js
import express from "express";
import { PendingIncomeRequests } from "../models/PendingIncomeRequests.js";
import { PendingLoanRequests } from "../models/PendingLoanRequests.js";
import User from "../models/User.js";
import { Income } from "../models/Income.js";
import mongoose from "mongoose";

const router = express.Router();

// GET /api/admin/pending-income
// Fetch all pending income verification requests with user & income details
router.get("/pending-income", async (req, res) => {
    try {
        const requests = await PendingIncomeRequests.find({ requestStatus: "pending" })
            .populate("user", "name phone email crediScore verificationStatus")
            .populate("income", "monthlyIncome pan bankAccountNo ifsc proofFilename proofFileId")
            .sort({ createdAt: -1 });

        res.json({ requests });
    } catch (err) {
        console.error("Error fetching pending income:", err);
        res.status(500).json({ msg: "Server error" });
    }
});

// PUT /api/admin/income-approve/:id
// Approve income verification request
router.put("/income-approve/:id", async (req, res) => {
    try {
        const requestId = req.params.id;
        const { adminNote } = req.body;

        const request = await PendingIncomeRequests.findById(requestId);
        if (!request || request.requestStatus !== "pending") {
            return res.status(400).json({ msg: "Invalid or already processed request" });
        }

        // Update request status
        request.requestStatus = "approved";
        if (adminNote) request.adminNote = adminNote;
        await request.save();

        // Sync to User (single source of truth)
        const user = await User.findById(request.user);
        if (user) {
            user.verificationStatus = "approved";
            if (adminNote) user.adminNote = adminNote;
            user.crediScore = user.crediScore + 50;
            await user.save();
        }

        res.json({ msg: "Income verification approved successfully" });
    } catch (err) {
        console.error("Error approving income:", err);
        res.status(500).json({ msg: "Server error" });
    }
});

// PUT /api/admin/income-reject/:id
// Reject income verification request
router.put("/income-reject/:id", async (req, res) => {
    try {
        const requestId = req.params.id;
        const { adminNote } = req.body;

        const request = await PendingIncomeRequests.findById(requestId);
        if (!request || request.requestStatus !== "pending") {
            return res.status(400).json({ msg: "Invalid or already processed request" });
        }

        // Update request status
        request.requestStatus = "rejected";
        if (adminNote) request.adminNote = adminNote;
        await request.save();

        // Sync to User
        const user = await User.findById(request.user);
        if (user) {
            user.verificationStatus = "rejected";
            if (adminNote) user.adminNote = adminNote;
            await user.save();
        }

        res.json({ msg: "Income verification rejected successfully" });
    } catch (err) {
        console.error("Error rejecting income:", err);
        res.status(500).json({ msg: "Server error" });
    }
});

// GET /api/admin/pending-loans
// Fetch all pending loan requests with user details
router.get("/pending-loans", async (req, res) => {
    try {
        const requests = await PendingLoanRequests.find({ requestStatus: "pending" })
            .populate("user", "name phone email crediScore creditLimit remainingLimit")
            .sort({ createdAt: -1 });

        res.json({ requests });
    } catch (err) {
        console.error("Error fetching pending loans:", err);
        res.status(500).json({ msg: "Server error" });
    }
});

// PUT /api/admin/loan-approve/:id
// Approve loan request
router.put("/loan-approve/:id", async (req, res) => {
    try {
        const requestId = req.params.id;
        const { adminNote } = req.body;

        const request = await PendingLoanRequests.findById(requestId);
        if (!request || request.requestStatus !== "pending") {
            return res.status(400).json({ msg: "Invalid or already processed request" });
        }

        // Update request status
        request.requestStatus = "approved";
        if (adminNote) request.adminNote = adminNote;
        request.disbursedAmount = request.requestedAmount; // Disburse full amount
        request.disbursedAt = new Date();
        await request.save();

        // Sync to User (reduce remaining limit, increase active loans)
        const user = await User.findById(request.user);
        if (user) {
            // console.log(user.remainingLimit, request.disbursedAmount);
            // user.remainingLimit = Math.max(0, user.remainingLimit - request.disbursedAmount);
            user.activeLoansCount += 1;
            await user.save();
        }

        res.json({ msg: "Loan approved and disbursed successfully" });
    } catch (err) {
        console.error("Error approving loan:", err);
        res.status(500).json({ msg: "Server error" });
    }
});

// PUT /api/admin/loan-reject/:id
// Reject loan request
router.put("/loan-reject/:id", async (req, res) => {
    try {
        const requestId = req.params.id;
        const { adminNote } = req.body;

        const request = await PendingLoanRequests.findById(requestId);
        if (!request || request.requestStatus !== "pending") {
            return res.status(400).json({ msg: "Invalid or already processed request" });
        }

        // Update request status
        request.requestStatus = "rejected";
        if (adminNote) request.adminNote = adminNote;
        await request.save();

        res.json({ msg: "Loan request rejected successfully" });
    } catch (err) {
        console.error("Error rejecting loan:", err);
        res.status(500).json({ msg: "Server error" });
    }
});


router.get("/view-proof/:incomeId", async (req, res) => {
    try {
        // 1. Find the Income record to get the proofFileId
        const income = await Income.findById(req.params.incomeId);

        if (!income || !income.proofFileId) {
            return res.status(404).json({ msg: "Proof file not found" });
        }

        // 2. Initialize GridFS Bucket
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: "proofs",
        });

        // 3. Set headers so the browser renders PDF/Images correctly
        // We look up the file metadata to get the original contentType
        const file = await bucket.find({ _id: income.proofFileId }).next();

        if (!file) {
            return res.status(404).json({ msg: "File does not exist in GridFS" });
        }

        res.set("Content-Type", file.contentType);
        res.set("Content-Disposition", `inline; filename="${file.filename}"`);

        // 4. Stream the file from GridFS directly to the Admin's browser
        const downloadStream = bucket.openDownloadStream(income.proofFileId);

        downloadStream.on("error", (err) => {
            res.status(404).json({ msg: "Error streaming file" });
        });

        downloadStream.pipe(res);
    } catch (err) {
        console.error("View proof error:", err);
        res.status(500).json({ msg: "Server error" });
    }
});

export default router;
