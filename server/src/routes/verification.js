// src/routes/verification.js
import express from "express";
import auth from "../middleware/auth.js";
import { Income } from "../models/Income.js";
import { PendingIncomeRequests } from "../models/PendingIncomeRequests.js"; // Import the model
import User from "../models/User.js";
import upload from "../config/upload.js"; // Plain multer (memoryStorage)
import mongoose from "mongoose";

const router = express.Router();

// Step 1: Verify PAN, Account No, IFSC (Simulated)
router.post("/verify-details", auth, async (req, res) => {
    try {
        const { pan, accountNumber, ifsc } = req.body;
        const userId = req.user.id;

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

        // Simulated verification (demo data)
        const mockValidAccounts = [
            { pan: "ABCDE1234F", account: "123456789012", ifsc: "SBIN0001234" },
            { pan: "FGHIJ5678K", account: "987654321098", ifsc: "HDFC0000256" },
            { pan: "LMNOP9876Z", account: "555566667777", ifsc: "ICIC0000001" },
        ];

        const isValid = mockValidAccounts.some(
            (acc) =>
                acc.pan === pan.toUpperCase() &&
                acc.account === accountNumber &&
                acc.ifsc === ifsc.toUpperCase()
        );

        if (!isValid) {
            return res.status(400).json({
                msg: "Verification failed. Details do not match.",
            });
        }

        // Save verified details
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

// Step 2: Upload proof using MongoDB native GridFSBucket
router.post("/upload-proof", auth, upload.single("proof"), async (req, res) => {
    try {
        const userId = req.user.id;
        if (!req.file) {
            return res.status(400).json({ msg: "No file uploaded" });
        }

        // Create GridFS bucket
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: "proofs",
        });

        // Create upload stream
        const uploadStream = bucket.openUploadStream(req.file.originalname, {
            contentType: req.file.mimetype,
        });

        // Pipe the file buffer into the stream
        uploadStream.end(req.file.buffer);

        // On successful upload
        uploadStream.on("finish", async () => {
            try {
                // Update Income with proof details
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

                // Create a PendingIncomeRequests document (this triggers the admin queue)
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

        // On error during upload
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