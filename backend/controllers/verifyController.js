const mockBankData = require("../mockData.json");
const calculateCreditScore = require("../utils/creditScore");
const Loan = require("../models/Loan");

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

exports.verifyUser = async (req, res) => {
  const {
    bankId,
    panNumber,
    salary,
    requestedAmount,
    maritalStatus = "Single",
    nationality = "Indian",
    age = 25,
    dependents = 0
  } = req.body;

  if (!bankId || !panNumber || !salary || !requestedAmount)
    return res.json({ status: "Error", message: "Missing required fields" });

  if (!PAN_REGEX.test(panNumber))
    return res.json({ status: "Rejected", message: "Invalid PAN format" });

  const bankUser = mockBankData.find(u => u.id == bankId);
  if (!bankUser)
    return res.json({ status: "Rejected", message: "Invalid Bank Id" });

  if (bankUser.pan !== panNumber)
    return res.json({ status: "Rejected", message: "PAN mismatch" });

  if (salary < bankUser.salary)
    return res.json({ status: "Rejected", message: "Salary too low" });

  const panDoc = req.files.pan?.[0].path;
  const salarySlip = req.files.salarySlip?.[0].path;

  if (!panDoc || !salarySlip)
    return res.json({ status: "Error", message: "Documents required" });

  const userForm = {
    requestedAmount: Number(requestedAmount),
    salary: Number(salary),
    maritalStatus,
    nationality,
    age: Number(age),
    dependents: Number(dependents)
  };

  const creditScore = calculateCreditScore(userForm, bankUser);
  const approvalStatus = creditScore >= 650 ? "Pre-Approved" : "Pre-Rejected";

  const loan = new Loan({
    bankId,
    panNumber,
    salary,
    requestedAmount,
    maritalStatus,
    nationality,
    age,
    dependents,
    creditScore,
    approvalStatus,
    adminFinalStatus: "Pending",
    documents: { panDoc, salarySlip }
  });

  await loan.save();

  res.json({
    status: "Success",
    message: "Application processed",
    creditScore,
    systemDecision: approvalStatus,
    loanId: loan._id
  });
};

exports.adminUpdateLoan = async (req, res) => {
  const { decision } = req.body;

  if (!["Approved", "Rejected"].includes(decision))
    return res.json({ message: "Decision must be Approved or Rejected" });

  const loan = await Loan.findByIdAndUpdate(
    req.params.id,
    { adminFinalStatus: decision },
    { new: true }
  );

  res.json({ message: "Updated", loan });
};

exports.getAllLoans = async (req, res) => {
  const loans = await Loan.find().sort({ createdAt: -1 });
  res.json(loans);
};

exports.getApprovedLoans = async (req, res) => {
  const loans = await Loan.find({ adminFinalStatus: "Approved" });
  res.json(loans);
};

exports.getRejectedLoans = async (req, res) => {
  const loans = await Loan.find({ adminFinalStatus: "Rejected" });
  res.json(loans);
};
