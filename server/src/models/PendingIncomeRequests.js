import mongoose from "mongoose";

const PendingIncomeRequestsSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        income: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Income",
            required: true,
        },
        requestStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        adminNote: { type: String },
    },
    { timestamps: true }
);














PendingIncomeRequestsSchema.pre("save", async function () {
    if (this.isNew) {
        try {
            const user = await mongoose.model("User").findById(this.user);
            if (user) {
                user.verificationStatus = "pending";
                await user.save();
            }
        } catch (err) {
            console.error("Error setting pending status:", err);
        }
    }
});


PendingIncomeRequestsSchema.post("save", async function (doc) {
    if (doc.requestStatus === "approved" || doc.requestStatus === "rejected") {
        try {
            const user = await mongoose.model("User").findById(doc.user);
            if (user) {
                user.verificationStatus = doc.requestStatus;
                if (doc.adminNote) user.adminNote = doc.adminNote;
                await user.save();
            }
        } catch (err) {
            console.error("Error syncing verification status:", err);
        }
    }
});

export const PendingIncomeRequests = mongoose.model(
    "PendingIncomeRequests",
    PendingIncomeRequestsSchema
);