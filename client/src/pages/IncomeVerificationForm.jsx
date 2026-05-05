import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import {
    MdCheckCircle,
    MdError,
    MdArrowBack,
    MdCreditCard,
    MdAccountBalance,
    MdUpload,
    MdArrowForward,
} from "react-icons/md";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";

export default function IncomeVerificationForm() {
    const { user, refreshUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [step, setStep] = useState(1);

    const [panNumber, setPanNumber] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [ifscCode, setIfscCode] = useState("");

    const [proofFile, setProofFile] = useState(null);

    const [loadingStep1, setLoadingStep1] = useState(false);
    const [step1Message, setStep1Message] = useState("");
    const [step1Success, setStep1Success] = useState(false);

    const [loadingStep2, setLoadingStep2] = useState(false);
    const [step2Message, setStep2Message] = useState("");

    const isPanValid = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber.toUpperCase());
    const isIfscValid = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.toUpperCase());
    const canVerifyStep1 = isPanValid && accountNumber && isIfscValid;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProofFile(file);
        }
    };

    const handleVerifyStep1 = async () => {
        if (!canVerifyStep1) return;
        setLoadingStep1(true);
        setStep1Message("");
        try {
            const res = await api.post("/verification/verify-details", {
                pan: panNumber.toUpperCase(),
                accountNumber,
                ifsc: ifscCode.toUpperCase(),
            });
            setStep1Message(res.data.msg || "Details verified successfully!");
            setStep1Success(true);
        } catch (err) {
            setStep1Message(err.response?.data?.msg || "Verification failed. Check your details.");
            setStep1Success(false);
        } finally {
            setLoadingStep1(false);
        }
    };

    const handleSubmitStep2 = async () => {
        if (!proofFile || !step1Success) return;
        setLoadingStep2(true);
        setStep2Message("");
        const formData = new FormData();
        formData.append("proof", proofFile);
        formData.append("pan", panNumber.toUpperCase());
        formData.append("accountNumber", accountNumber);
        formData.append("ifsc", ifscCode.toUpperCase());
        try {
            await api.post("/verification/upload-proof", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setStep2Message("Income verification completed successfully!");
            if (refreshUser) await refreshUser();
            setTimeout(() => navigate("/dashboard"), 1500);
        } catch (err) {
            setStep2Message(err.response?.data?.msg || "Upload failed. Please try again.");
        } finally {
            setLoadingStep2(false);
        }
    };

    return (
        <div className="flex-grow py-12 px-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-emerald-100/40 rounded-full blur-[100px]" />
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            </div>

            <div className="max-w-2xl mx-auto relative z-10">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black uppercase tracking-widest text-[10px] mb-8 transition-all"
                >
                    <MdArrowBack size={16} /> Exit Verification
                </button>

                {/* Simplified Progress Indicator */}
                <div className="flex items-center justify-center gap-8 mb-12">
                    <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-[10px] transition-all ${step >= 1 ? "bg-slate-900 text-white" : "bg-white text-slate-300 border border-slate-100"}`}>1</div>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${step >= 1 ? "text-slate-900" : "text-slate-300"}`}>Account Details</span>
                    </div>
                    <div className="w-12 h-[2px] bg-slate-100" />
                    <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-[10px] transition-all ${step >= 2 ? "bg-slate-900 text-white" : "bg-white text-slate-300 border border-slate-100"}`}>2</div>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${step >= 2 ? "text-slate-900" : "text-slate-300"}`}>Document Upload</span>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-50 overflow-hidden p-8 md:p-12">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div 
                                key="step1"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="text-center md:text-left">
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">KYC & Banking</h2>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Verify your legal and financial identifiers</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">PAN Identifier</label>
                                        <div className="relative">
                                            <MdCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="text"
                                                value={panNumber}
                                                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                                                placeholder="ABCDE1234F"
                                                maxLength="10"
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-50 rounded-xl text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-all font-mono tracking-widest"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Account Number</label>
                                            <div className="relative">
                                                <MdAccountBalance className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    type="text"
                                                    value={accountNumber}
                                                    onChange={(e) => setAccountNumber(e.target.value)}
                                                    placeholder="Enter 10-16 digits"
                                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-50 rounded-xl text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">IFSC Routing</label>
                                            <input
                                                type="text"
                                                value={ifscCode}
                                                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                                                placeholder="SBIN0001234"
                                                maxLength="11"
                                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-50 rounded-xl text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-all font-mono tracking-wider"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        onClick={handleVerifyStep1}
                                        disabled={loadingStep1 || !canVerifyStep1}
                                        className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all shadow-xl active:scale-95 ${canVerifyStep1 && !loadingStep1 ? "bg-slate-900 text-white hover:bg-blue-600" : "bg-slate-100 text-slate-300"}`}
                                    >
                                        {loadingStep1 ? "Processing..." : "Verify Identity"}
                                    </button>

                                    {step1Message && (
                                        <div className={`p-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-center border ${step1Success ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"}`}>
                                            {step1Message}
                                        </div>
                                    )}

                                    {step1Success && (
                                        <button
                                            onClick={() => setStep(2)}
                                            className="w-full py-4 bg-emerald-500 text-white rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-emerald-600 transition-all shadow-xl flex items-center justify-center gap-2"
                                        >
                                            Continue to Upload <MdArrowForward />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="step2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-center space-y-8"
                            >
                                <div className="text-center md:text-left">
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Document Proof</h2>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Upload bank statement or salary slip</p>
                                </div>

                                <div className="border-4 border-dashed border-slate-100 rounded-[2rem] p-12 hover:border-blue-200 transition-all bg-slate-50/50">
                                    <MdUpload className="text-6xl text-slate-300 mx-auto mb-6" />
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            accept="application/pdf,image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <span className="bg-white border border-slate-200 text-slate-900 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm inline-block">
                                            {proofFile ? "Change File" : "Select Document"}
                                        </span>
                                    </label>

                                    {proofFile && (
                                        <div className="mt-6 flex items-center justify-center gap-3 text-emerald-600 text-[11px] font-black uppercase tracking-widest">
                                            <MdCheckCircle size={20} />
                                            {proofFile.name}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-4 bg-slate-100 text-slate-900 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleSubmitStep2}
                                        disabled={loadingStep2 || !proofFile}
                                        className={`flex-[2] py-4 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all shadow-xl active:scale-95 ${proofFile && !loadingStep2 ? "bg-slate-900 text-white hover:bg-blue-600" : "bg-slate-100 text-slate-300"}`}
                                    >
                                        {loadingStep2 ? "Analyzing..." : "Complete Verification"}
                                    </button>
                                </div>

                                {step2Message && (
                                    <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                                        {step2Message}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}