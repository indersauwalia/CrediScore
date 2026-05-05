import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { MdArrowBack, MdArrowForward, MdCheckCircle, MdInfoOutline, MdAccountBalance, MdTimeline } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { loanSchemes } from "../utils/loanSchemes";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";

function calculateEMI(P, r, n) {
  const monthlyRate = r / 12 / 100;
  if (monthlyRate === 0) return P / n;
  return (
    (P * monthlyRate * Math.pow(1 + monthlyRate, n)) /
    (Math.pow(1 + monthlyRate, n) - 1)
  );
}

export default function LoanApplication() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const scheme = loanSchemes.find(s => s.id === parseInt(id));
  
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(0);
  const [tenure, setTenure] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!scheme) {
      navigate("/loans");
      return;
    }
    
    // Initialize values based on scheme
    setAmount(getMaxAmount(scheme));
    const [min] = scheme.tenure.split("-").map((s) => parseInt(s));
    setTenure(min);
  }, [user, scheme, navigate]);

  if (!user || !scheme) return null;

  const getMaxAmount = (scheme) => {
    const userLimit = user.creditLimit || 50000;
    const crediScore = user.crediScore || 0;
    if (scheme.title === "Salary Advance") {
      return Math.min(Math.floor(userLimit * 0.6), scheme.maxAmount);
    }
    if (scheme.title === "Business Boost Loan") {
      return crediScore >= 700 ? Math.min(200000, userLimit) : Math.min(100000, userLimit);
    }
    return Math.min(scheme.maxAmount, userLimit);
  };

  const getInterestRate = (scheme) => {
    const crediScore = user.crediScore || 0;
    if (scheme.title === "Personal Loan") {
      if (crediScore >= 750) return 10.5;
      if (crediScore >= 650) return 12.0;
      return scheme.baseRate;
    }
    return scheme.baseRate;
  };

  const maxAmount = getMaxAmount(scheme);
  const [minTenure, maxTenure] = scheme.tenure.split("-").map((s) => parseInt(s));
  const interestRate = getInterestRate(scheme);

  const emi = calculateEMI(amount, interestRate, tenure);
  const totalPayable = emi * tenure;
  const totalInterest = totalPayable - amount;

  const canNext =
    (step === 1 && amount >= 1000 && amount <= maxAmount) ||
    (step === 2 && tenure >= minTenure && tenure <= maxTenure) ||
    step === 3;

  const handleConfirm = async () => {
    const applicationData = {
      loanType: scheme.title,
      requestedAmount: amount,
      tenure: tenure,
      interestRate: interestRate,
      processingFee: scheme.processingFee,
    };
    try {
      const res = await api.post("/loans/apply", applicationData);
      if (res.status === 200 || res.status === 201) {
        alert("Loan application submitted successfully!");
        navigate("/dashboard");
      }
    } catch (err) {
      const msg = err.response?.data?.msg || "Application failed.";
      alert(`Error: ${msg}`);
    }
  };

  const steps = [
    { id: 1, title: "Amount", icon: <MdAccountBalance /> },
    { id: 2, title: "Tenure", icon: <MdTimeline /> },
    { id: 3, title: "Review", icon: <MdCheckCircle /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header - More Compact */}
        <div className="flex items-center justify-between mb-8">
          <button
            className="flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-colors text-sm"
            onClick={() => navigate("/loans")}
          >
            <MdArrowBack size={18} />
            Back
          </button>
          <div className="flex items-center gap-3">
            {steps.map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                  step === s.id ? "bg-slate-900 text-white shadow-lg" : step > s.id ? "bg-emerald-500 text-white" : "bg-white text-slate-300 border border-slate-200"
                }`}>
                  {step > s.id ? <MdCheckCircle size={16} /> : s.id}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:inline ${
                  step === s.id ? "text-slate-800" : "text-slate-300"
                }`}>{s.title}</span>
                {s.id < 3 && <div className="w-4 h-[2px] bg-slate-200" />}
              </div>
            ))}
          </div>
        </div>

        {/* Card Container - Slimmer */}
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
          <div className="p-6 md:p-10">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-black text-slate-900 mb-1 uppercase tracking-tight">Select Amount</h2>
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Product: <span className="text-blue-600">{scheme.title}</span></p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-8 text-center space-y-6 border border-slate-100">
                    <div className="text-5xl font-black text-slate-900 tracking-tighter">
                      ₹{amount.toLocaleString()}
                    </div>
                    <div className="px-2">
                        <input
                        type="range"
                        min={1000}
                        max={maxAmount}
                        step={1000}
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                        />
                    </div>
                    <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">
                      <span>Min ₹1,000</span>
                      <span>Max ₹{maxAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
                    <MdInfoOutline className="text-xl shrink-0" />
                    <p className="text-[10px] font-bold uppercase tracking-tight">Your personalized limit is based on your current CrediScore of <b>{user.crediScore}</b>.</p>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-black text-slate-900 mb-1 uppercase tracking-tight">Repayment Plan</h2>
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Choose the duration that fits your budget.</p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-8 text-center space-y-6 border border-slate-100">
                    <div className="text-5xl font-black text-slate-900 tracking-tighter">
                      {tenure} <span className="text-xl text-slate-400">Mo</span>
                    </div>
                    <div className="px-2">
                        <input
                        type="range"
                        min={minTenure}
                        max={maxTenure}
                        step={1}
                        value={tenure}
                        onChange={(e) => setTenure(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                        />
                    </div>
                    <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">
                      <span>{minTenure} Months</span>
                      <span>{maxTenure} Months</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                      <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Estimated EMI</p>
                      <p className="text-xl font-black text-emerald-800 tracking-tighter">₹{Math.round(emi).toLocaleString()}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                      <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">Interest Rate</p>
                      <p className="text-xl font-black text-blue-800 tracking-tighter">{interestRate}% <span className="text-[10px] font-medium opacity-50">p.a.</span></p>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-black text-slate-900 mb-1 uppercase tracking-tight">Review Terms</h2>
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Confirm your final loan configuration.</p>
                  </div>

                  <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -mr-24 -mt-24"></div>
                    
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <span className="text-slate-500 font-black uppercase tracking-widest text-[9px]">Loan Product</span>
                      <span className="text-sm font-black uppercase">{scheme.title}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <span className="text-slate-500 font-black uppercase tracking-widest text-[9px]">Principal</span>
                      <span className="text-2xl font-black tracking-tighter">₹{amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <span className="text-slate-500 font-black uppercase tracking-widest text-[9px]">Total Interest</span>
                      <span className="text-sm font-black text-emerald-400">₹{Math.round(totalInterest).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-slate-300 font-black uppercase tracking-widest text-[9px]">Total Payable</span>
                      <span className="text-2xl font-black text-blue-400 tracking-tighter">₹{Math.round(totalPayable).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start gap-3">
                    <MdInfoOutline className="text-lg text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-amber-800 font-bold uppercase tracking-tight leading-relaxed">
                      Funds will be disbursed to your linked bank account after digital verification. 
                      Standard processing time: 24-48 hours.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer Actions */}
            <div className="mt-8 flex gap-3">
              {step > 1 && (
                <button
                  className="flex-1 py-3.5 rounded-xl font-black text-slate-500 bg-slate-50 hover:bg-slate-100 transition-all text-xs uppercase tracking-widest"
                  onClick={() => setStep(s => s - 1)}
                >
                  Back
                </button>
              )}
              <button
                className={`flex-[2] py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 ${
                  canNext
                    ? "bg-slate-900 text-white hover:bg-blue-600 shadow-lg"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
                onClick={() => {
                  if (step < 3) setStep(s => s + 1);
                  else handleConfirm();
                }}
                disabled={!canNext}
              >
                {step < 3 ? "Next Step" : "Submit Application"}
                <MdArrowForward size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
