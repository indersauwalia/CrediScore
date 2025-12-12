const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  bankId: Number,
  panNumber: String,
  salary: Number,
  requestedAmount: Number,
  maritalStatus: String,
  nationality: String,
  age: Number,
  dependents: Number,
  creditScore: Number,
  approvalStatus: String,    // system decision
  adminFinalStatus: {
    type: String,
    enum: ["Approved", "Rejected", "Pending"],
    default: "Pending"
  },
  documents: {
    panDoc: String,
    salarySlip: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Loan", loanSchema);
