import mongoose from "mongoose";

const PendingLoanRequestsSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        loanType: {
            type: String,
            required: true,
            // Expanded to include all frontend schemes
            enum: [
                "Personal Loan",
                "Salary Advance",
                "Business Boost Loan",
                "Education Loan",
                "Two-Wheeler Loan",
                "Medical Emergency Loan",
            ],
        },
        requestedAmount: {
            type: Number,
            required: true,
        },
        tenure: {
            type: Number, // in months
            required: true,
            // Increased max to 60 to accommodate Education Loans
            max: 60,
        },
        interestRate: {
            type: Number, // in %
            required: true,
        },
        processingFee: {
            type: String,
        },
        requestStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        adminNote: { type: String },
        disbursedAmount: { type: Number, default: 0 },
        disbursedAt: { type: Date },
    },
    { timestamps: true }
);

// Hook: Updates User's credit limits automatically upon approval
PendingLoanRequestsSchema.post("save", async function (doc) {
    if (doc.requestStatus === "approved" && doc.disbursedAmount > 0) {
        try {
            const User = mongoose.model("User");
            const user = await User.findById(doc.user);
            if (user) {
                // Subtract the disbursed amount from the user's remaining limit
                user.remainingLimit = Math.max(0, user.remainingLimit - doc.disbursedAmount);
                user.activeLoansCount = (user.activeLoansCount || 0) + 1;
                await user.save();
            }
        } catch (err) {
            console.error("Error updating user on loan approval:", err);
        }
    }
});

export const PendingLoanRequests = mongoose.model("PendingLoanRequests", PendingLoanRequestsSchema);