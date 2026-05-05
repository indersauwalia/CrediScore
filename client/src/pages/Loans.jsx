import { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { GiReceiveMoney, GiPiggyBank } from "react-icons/gi";
import { 
    MdArrowForward, 
    MdVerified, 
    MdWarning, 
    MdBlock, 
    MdHourglassEmpty, 
    MdSearch, 
    MdFilterList, 
    MdInfoOutline,
    MdTrendingUp,
    MdAccountBalanceWallet,
    MdStars
} from "react-icons/md";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { loanSchemes } from "../utils/loanSchemes";

export default function LoanPage() {
    const { user, refreshUser } = useContext(AuthContext);
    const [myApplications, setMyApplications] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("default");
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/", { replace: true });
        } else {
            if (user.verificationStatus !== "approved") {
                refreshUser();
            }
            fetchMyApplications();
        }
    }, []);

    const fetchMyApplications = async () => {
        try {
            const res = await api.get("/loans/my-requests");
            setMyApplications(res.data || []);
        } catch (err) {
            console.error("Error fetching applications:", err);
        }
    };

    if (!user) return null;

    const verificationStatus = user.verificationStatus?.toLowerCase() || "not-started";
    const crediScore = user.crediScore || 0;
    const remainingLimit = user.remainingLimit || 0;
    const isEligible = verificationStatus === "approved" && remainingLimit > 0;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getMaxAmount = (scheme) => {
        const userLimit = user.creditLimit || 50000;
        if (scheme.title === "Salary Advance") {
            return Math.min(Math.floor(userLimit * 0.6), scheme.maxAmount);
        }
        if (scheme.title === "Business Boost Loan") {
            return crediScore >= 700 ? Math.min(200000, userLimit) : Math.min(100000, userLimit);
        }
        return Math.min(scheme.maxAmount, userLimit);
    };

    const getInterestRate = (scheme) => {
        if (scheme.title === "Personal Loan") {
            if (crediScore >= 750) return 10.5;
            if (crediScore >= 650) return 12.0;
            return scheme.baseRate;
        }
        return scheme.baseRate;
    };

    const isRecommended = (scheme) => {
        if (scheme.title === "Personal Loan") return crediScore >= 800;
        if (scheme.title === "Salary Advance") return verificationStatus === "approved" && crediScore >= 600;
        if (scheme.title === "Business Boost Loan") return crediScore >= 700;
        if (scheme.title === "Education Loan") return crediScore >= 750;
        if (scheme.title === "Two-Wheeler Loan") return crediScore >= 650;
        if (scheme.title === "Medical Emergency Loan") return crediScore >= 700;
        return false;
    };

    const filteredAndSortedSchemes = useMemo(() => {
        let results = loanSchemes.filter(s => 
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (sortBy === "rate-low") {
            results.sort((a, b) => getInterestRate(a) - getInterestRate(b));
        } else if (sortBy === "amount-high") {
            results.sort((a, b) => getMaxAmount(b) - getMaxAmount(a));
        } else if (sortBy === "recommended") {
            results.sort((a, b) => (isRecommended(b) ? 1 : 0) - (isRecommended(a) ? 1 : 0));
        }

        return results;
    }, [searchQuery, sortBy, crediScore, user.creditLimit]);

    const handleApply = (scheme) => {
        navigate(`/loans/apply/${scheme.id}`);
    };

    return (
        <div>
            {/* Hero Section - More Compact */}
            <div className="relative bg-linear-to-br from-blue-900 via-indigo-800 to-blue-900 pt-10 pb-20 px-6 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight"
                    >
                        Loan Marketplace
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-base text-blue-100 max-w-lg mx-auto mb-8 opacity-80"
                    >
                        Discover premium credit products tailored to your CrediScore profile.
                    </motion.p>

                    {/* Stats Bar - Compact */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto"
                    >
                        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3 text-white text-left">
                            <div className="flex items-center gap-2 mb-0.5">
                                <MdStars className="text-emerald-400 text-base" />
                                <span className="text-blue-200 text-[9px] font-bold uppercase tracking-widest">Score</span>
                            </div>
                            <div className="text-xl font-black">{crediScore}</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3 text-white text-left">
                            <div className="flex items-center gap-2 mb-0.5">
                                <MdAccountBalanceWallet className="text-blue-300 text-base" />
                                <span className="text-blue-200 text-[9px] font-bold uppercase tracking-widest">Available</span>
                            </div>
                            <div className="text-xl font-black">{formatCurrency(remainingLimit)}</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3 text-white text-left">
                            <div className="flex items-center gap-2 mb-0.5">
                                <MdTrendingUp className="text-indigo-300 text-base" />
                                <span className="text-blue-200 text-[9px] font-bold uppercase tracking-widest">Profile</span>
                            </div>
                            <div className="text-xs font-black text-emerald-400 uppercase">
                                {verificationStatus === "approved" ? "Verified" : "Action Required"}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-6 -mt-8 pb-4 relative z-20">
                {/* Search Bar - Slimmer */}
                <div className="bg-white rounded-xl shadow-lg p-2.5 mb-6 flex flex-col md:flex-row gap-2.5 items-center border border-slate-100">
                    <div className="relative flex-1 w-full">
                        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                        <input 
                            type="text" 
                            placeholder="Search loan types..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-lg border-none text-xs font-medium focus:ring-1 focus:ring-blue-500 outline-none transition"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select 
                        className="w-full md:w-40 px-3 py-2 bg-slate-50 rounded-lg border-none text-xs font-bold focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="default">Sort By</option>
                        <option value="recommended">Recommended</option>
                        <option value="rate-low">Interest Rate</option>
                        <option value="amount-high">Max Amount</option>
                    </select>
                </div>

                {!isEligible && (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-6"
                    >
                        {verificationStatus !== "approved" ? (
                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-center gap-3">
                                <MdWarning className="text-xl text-amber-600" />
                                <div className="flex-1">
                                    <h3 className="text-xs font-black text-amber-900 uppercase tracking-tight">Verification Required</h3>
                                    <p className="text-[10px] text-amber-800">Complete KYC to unlock full borrowing limits.</p>
                                </div>
                                <button 
                                    onClick={() => navigate("/verify-income")}
                                    className="bg-amber-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase hover:bg-amber-700 transition"
                                >
                                    Verify
                                </button>
                            </div>
                        ) : (
                            <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-3">
                                <MdBlock className="text-xl text-red-600" />
                                <p className="text-[10px] font-black text-red-900 uppercase">Limit Exhausted. Please repay active loans.</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Schemes Grid - Compact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <AnimatePresence mode="popLayout">
                        {filteredAndSortedSchemes.map((scheme, idx) => {
                            const maxAmt = getMaxAmount(scheme);
                            const rate = getInterestRate(scheme);
                            const currentSchemeRecommended = isRecommended(scheme) && isEligible;
                            const existingRequest = myApplications.find(
                                (app) => app.loanType === scheme.title && app.requestStatus === "pending"
                            );

                            const [minTenure] = scheme.tenure.split("-").map((s) => parseInt(s));
                            const monthlyRate = rate / 12 / 100;
                            const minEMI = Math.round(
                                maxAmt > 0 ? (maxAmt * monthlyRate * Math.pow(1 + monthlyRate, minTenure)) / (Math.pow(1 + monthlyRate, minTenure) - 1) : 0
                            );

                            return (
                                <motion.div
                                    layout
                                    key={scheme.id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                                    className={`group relative bg-white rounded-2xl p-5 border transition-all duration-300 hover:shadow-xl ${
                                        currentSchemeRecommended ? "border-emerald-200 ring-1 ring-emerald-50" : "border-slate-100"
                                    }`}
                                >
                                    {currentSchemeRecommended && (
                                        <div className="absolute -top-2 left-5 bg-emerald-500 text-white px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-md">
                                            Best Match
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`p-2 rounded-lg ${currentSchemeRecommended ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>
                                            <GiReceiveMoney className="text-lg" />
                                        </div>
                                        <span className="text-[8px] font-black text-slate-400 uppercase bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                                            {scheme.tag}
                                        </span>
                                    </div>

                                    <h3 className="text-base font-black text-slate-800 mb-0.5">{scheme.title}</h3>
                                    <p className="text-slate-500 text-[11px] mb-4 h-8 line-clamp-2 leading-tight">{scheme.description}</p>

                                    <div className="space-y-2.5 mb-5">
                                        <div className="flex justify-between items-end border-b border-slate-50 pb-1.5">
                                            <div>
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Max Amount</p>
                                                <p className="text-lg font-black text-slate-900">{formatCurrency(maxAmt)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Interest</p>
                                                <p className="text-base font-black text-emerald-600">{rate}% <span className="text-[9px] text-slate-400 font-medium">p.a.</span></p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Tenure</p>
                                                <p className="text-[11px] font-black text-slate-700">{scheme.tenure} Mo</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Monthly</p>
                                                <p className="text-[11px] font-black text-slate-700">₹{minEMI.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        {existingRequest ? (
                                            <div className="w-full py-2 rounded-lg bg-amber-50 text-amber-600 text-[10px] font-black uppercase flex items-center justify-center gap-2 border border-amber-100">
                                                <MdHourglassEmpty className="animate-spin" />
                                                Pending Review
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleApply(scheme)}
                                                disabled={!isEligible}
                                                className={`w-full py-2.5 rounded-lg font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                                                    isEligible
                                                        ? "bg-slate-900 text-white hover:bg-blue-600 shadow-md active:scale-95"
                                                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                                }`}
                                            >
                                                {isEligible ? (
                                                    <>
                                                        Apply Now
                                                        <MdArrowForward size={14} className="group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                ) : "Not Eligible"}
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

        </div>
    );
}