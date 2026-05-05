import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { 
    MdWork, 
    MdPerson, 
    MdCreditCard, 
    MdArrowBack, 
    MdArrowForward, 
    MdCheckCircle,
    MdAccountBalanceWallet,
    MdSchool,
    MdHome,
    MdFamilyRestroom
} from "react-icons/md";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";

export default function CreditScoreForm() {
    const { user, refreshUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        monthlyIncome: "",
        monthlyExpense: "",
        employmentType: "salaried",
        designation: "",
        totalExpYears: "",
        currentExpYears: "",
        educationLevel: "",
        gender: "",
        maritalStatus: "",
        dependents: "",
        residenceType: "",
        existingEmi: "",
        creditCardSpend: ""
    });

    useEffect(() => {
        if (!user) return;
        const income = user.income;
        if (income) {
            setFormData({
                monthlyIncome: income.monthlyIncome?.toString() || "",
                monthlyExpense: income.monthlyExpense?.toString() || "",
                employmentType: income.employmentType || "salaried",
                designation: income.designation || "",
                totalExpYears: income.totalExpYears?.toString() || "",
                currentExpYears: income.currentExpYears?.toString() || "",
                dependents: income.dependents?.toString() || "",
                residenceType: income.residenceType || "",
                existingEmi: income.existingEmi?.toString() || "",
                creditCardSpend: income.creditCardSpend?.toString() || "",
                gender: user.gender || "",
                maritalStatus: user.maritalStatus || "",
                educationLevel: user.educationLevel || ""
            });
        } else {
            setFormData(prev => ({
                ...prev,
                gender: user.gender || "",
                maritalStatus: user.maritalStatus || "",
                educationLevel: user.educationLevel || ""
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const isStep1Valid = formData.gender && formData.maritalStatus && formData.educationLevel && formData.residenceType;
    const isStep2Valid = formData.monthlyIncome > 0 && formData.employmentType && formData.totalExpYears >= 0;
    const isStep3Valid = formData.monthlyExpense >= 0 && formData.existingEmi >= 0;

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = async () => {
        setLoading(true);
        setMessage("");

        const submissionData = {
            ...formData,
            monthlyIncome: Number(formData.monthlyIncome),
            monthlyExpense: Number(formData.monthlyExpense),
            totalExpYears: Number(formData.totalExpYears),
            currentExpYears: Number(formData.currentExpYears || 0),
            dependents: Number(formData.dependents || 0),
            existingEmi: Number(formData.existingEmi || 0),
            creditCardSpend: Number(formData.creditCardSpend || 0),
        };

        try {
            const res = await api.post("/credit/submit-income", submissionData);
            setMessage(`Success! New CrediScore: ${res.data.crediScore}`);
            if (refreshUser) await refreshUser();
            setTimeout(() => navigate("/dashboard"), 1500);
        } catch (err) {
            setMessage(err.response?.data?.msg || "Submission failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { id: 1, title: "Personal", icon: <MdPerson /> },
        { id: 2, title: "Employment", icon: <MdWork /> },
        { id: 3, title: "Financial", icon: <MdAccountBalanceWallet /> }
    ];

    return (
        <div className="flex-grow py-12 px-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-emerald-100/40 rounded-full blur-[100px]" />
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            </div>

            <div className="max-w-2xl mx-auto relative z-10">
                <button 
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black uppercase tracking-widest text-[10px] mb-8 transition-all"
                >
                    <MdArrowBack size={16} /> Exit Calculation
                </button>

                {/* Progress Stepper */}
                <div className="flex items-center justify-between mb-12 px-4">
                    {steps.map((s, i) => (
                        <React.Fragment key={s.id}>
                            <div className="flex flex-col items-center gap-2">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm ${
                                    step === s.id ? "bg-slate-900 text-white scale-110 shadow-xl" : step > s.id ? "bg-emerald-500 text-white" : "bg-white text-slate-300 border border-slate-200"
                                }`}>
                                    {step > s.id ? <MdCheckCircle size={20} /> : s.id}
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest ${step === s.id ? "text-slate-900" : "text-slate-300"}`}>
                                    {s.title}
                                </span>
                            </div>
                            {i < steps.length - 1 && (
                                <div className={`flex-1 h-[2px] mx-4 -mt-6 transition-all duration-500 ${step > s.id ? "bg-emerald-500" : "bg-slate-200"}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                    <div className="p-8 md:p-12">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div 
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center md:text-left mb-10">
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Profile Baseline</h2>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Foundational demographic information</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <MdPerson className="text-blue-500" /> Gender
                                            </label>
                                            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-all">
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <MdFamilyRestroom className="text-indigo-500" /> Marital Status
                                            </label>
                                            <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-all">
                                                <option value="">Select Status</option>
                                                <option value="single">Single</option>
                                                <option value="married">Married</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <MdSchool className="text-emerald-500" /> Education
                                            </label>
                                            <select name="educationLevel" value={formData.educationLevel} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-all">
                                                <option value="">Select Level</option>
                                                <option value="graduate">Graduate</option>
                                                <option value="postgraduate">Post Graduate</option>
                                                <option value="professional">Professional Degree</option>
                                                <option value="12th">12th Pass</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <MdHome className="text-amber-500" /> Residence
                                            </label>
                                            <select name="residenceType" value={formData.residenceType} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-all">
                                                <option value="">Select Type</option>
                                                <option value="owned">Owned</option>
                                                <option value="rented">Rented</option>
                                                <option value="family">Living with Family</option>
                                            </select>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div 
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center md:text-left mb-10">
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Economic Capacity</h2>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Employment and recurring income details</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    Monthly Income (₹)
                                                </label>
                                                <input name="monthlyIncome" type="number" value={formData.monthlyIncome} onChange={handleChange} placeholder="e.g. 50000" className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    Employment Type
                                                </label>
                                                <select name="employmentType" value={formData.employmentType} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-all">
                                                    <option value="salaried">Salaried</option>
                                                    <option value="self-employed">Self-Employed</option>
                                                    <option value="business">Business Owner</option>
                                                    <option value="freelancer">Freelancer</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    Total Experience (Years)
                                                </label>
                                                <input name="totalExpYears" type="number" value={formData.totalExpYears} onChange={handleChange} placeholder="e.g. 5" className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    Current Job (Years)
                                                </label>
                                                <input name="currentExpYears" type="number" value={formData.currentExpYears} onChange={handleChange} placeholder="e.g. 2" className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div 
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center md:text-left mb-10">
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Financial Discipline</h2>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Existing obligations and credit behavior</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    Monthly Expenses (₹)
                                                </label>
                                                <input name="monthlyExpense" type="number" value={formData.monthlyExpense} onChange={handleChange} placeholder="e.g. 20000" className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    Existing EMIs (₹)
                                                </label>
                                                <input name="existingEmi" type="number" value={formData.existingEmi} onChange={handleChange} placeholder="0 if none" className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-all" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <MdCreditCard className="text-rose-500" /> Avg Credit Card Spend (₹)
                                            </label>
                                            <input name="creditCardSpend" type="number" value={formData.creditCardSpend} onChange={handleChange} placeholder="Monthly average" className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-all" />
                                            <p className="text-[8px] font-bold text-slate-300 uppercase">Calculated based on previous 3-6 months statement average</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="mt-12 flex gap-4">
                            {step > 1 && (
                                <button 
                                    onClick={prevStep}
                                    className="flex-1 py-4 bg-slate-100 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all shadow-sm active:scale-95"
                                >
                                    Previous
                                </button>
                            )}
                            <button 
                                onClick={step === 3 ? handleSubmit : nextStep}
                                disabled={loading || (step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid) || (step === 3 && !isStep3Valid)}
                                className={`flex-[2] py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95 ${
                                    loading || (step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid) || (step === 3 && !isStep3Valid)
                                    ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                                    : "bg-slate-900 text-white hover:bg-blue-600 shadow-blue-200"
                                }`}
                            >
                                {loading ? "Analyzing..." : step === 3 ? "Generate Score" : "Continue"}
                                {step < 3 && <MdArrowForward size={14} />}
                            </button>
                        </div>

                        {message && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`mt-6 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border ${
                                    message.includes("Success") ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                                }`}
                            >
                                {message}
                            </motion.div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}