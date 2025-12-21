import express from "express";
import auth from "../middleware/auth.js";
import { Income } from "../models/Income.js";
import { PendingIncomeRequests } from "../models/PendingIncomeRequests.js"; 
import User from "../models/User.js";
import upload from "../config/upload.js"; 
import { mockValidAccounts } from "../config/demoData.js";
import mongoose from "mongoose";

const router = express.Router();

router.post("/verify-details", auth, async (req, res) => {
    try {
        const { pan, accountNumber, ifsc } = req.body;
        const userId = req.user.id;
        const user = await User.findById(userId);

        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

        if (!pan || !panRegex.test(pan.toUpperCase())) {
            return res.status(400).json({ msg: "Invalid or missing PAN number" });
        }
        if (!accountNumber || accountNumber.length < 8) {
            return res.status(400).json({ msg: "Invalid or missing account number" });
        }
        if (!ifsc || !ifscRegex.test(ifsc.toUpperCase())) {
            return res.status(400).json({ msg: "Invalid or missing IFSC code" });
        }

        const isValid = mockValidAccounts.some(
            (acc) =>
                acc.pan === pan.toUpperCase() &&
                acc.account === accountNumber &&
                acc.ifsc === ifsc.toUpperCase() &&
                acc.name.toLowerCase() === user.name.toLowerCase()
        );

        if (!isValid) {
            return res.status(400).json({
                msg: "Verification failed. Details do not match.",
            });
        }

        await Income.findOneAndUpdate(
            { user: userId },
            {
                pan: pan.toUpperCase(),
                bankAccountNo: accountNumber,
                ifsc: ifsc.toUpperCase(),
            },
            { upsert: true }
        );

        res.json({
            msg: "Details verified successfully! Proceed to upload proof.",
        });
    } catch (err) {
        console.error("Verify details error:", err);
        res.status(500).json({ msg: "Server error" });
    }
});























router.post("/upload-proof", auth, upload.single("proof"), async (req, res) => {
    try {
        const userId = req.user.id;
        if (!req.file) {
            return res.status(400).json({ msg: "No file uploaded" });
        }

        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: "proofs",
        });

        const uploadStream = bucket.openUploadStream(req.file.originalname, {
            contentType: req.file.mimetype,
        });

        uploadStream.end(req.file.buffer);

        uploadStream.on("finish", async () => {
            try {
                const updatedIncome = await Income.findOneAndUpdate(
                    { user: userId },
                    {
                        proofFileId: uploadStream.id,
                        proofFilename: req.file.originalname,
                    },
                    { new: true, upsert: true }
                );

                if (!updatedIncome) {
                    return res.status(404).json({ msg: "Income profile not found" });
                }

                await PendingIncomeRequests.create({
                    user: userId,
                    income: updatedIncome._id,
                    requestStatus: "pending",
                });

                res.json({
                    msg: "Proof uploaded successfully! Your income verification request has been submitted for admin review.",
                });
            } catch (error) {
                console.error("Save after upload error:", error);
                res.status(500).json({ msg: "Server error after upload" });
            }
        });

        uploadStream.on("error", (err) => {
            console.error("GridFS upload stream error:", err);
            res.status(500).json({ msg: "File upload failed" });
        });
    } catch (err) {
        console.error("Upload proof error:", err);
        res.status(500).json({ msg: "Server error" });
    }
});

export default router;