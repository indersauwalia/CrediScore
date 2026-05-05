import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { GiReceiveMoney, GiTrophy, GiProgression } from "react-icons/gi";
import { 
    MdTrendingUp, 
    MdArrowForward, 
    MdRefresh, 
    MdVerified, 
    MdInfoOutline, 
    MdLightbulb, 
    MdAccountBalanceWallet,
    MdSecurity,
    MdCalendarToday,
    MdKeyboardArrowDown,
    MdKeyboardArrowUp,
    MdCheckCircle
} from "react-icons/md";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
    const { user, refreshUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    const [showScoreAnalysis, setShowScoreAnalysis] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else {
            fetchDashboardStats();
        }
    }, [user]);

    const fetchDashboardStats = async () => {
        setLoadingData(true);
        try {
            const res = await api.get("/credit/stats");
            setStats(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingData(false);
        }
    };

    if (!user) return null;

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val || 0);
    };

    const crediScore = stats?.crediScore || 0;
    const verificationStatus = user.verificationStatus;

    return (
        <div className="flex-grow p-4 md:p-6 pb-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100/30 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-6xl mx-auto space-y-6 relative z-10">
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/50">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                                Overview
                            </h1>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.name}</span>
                            {verificationStatus === "approved" && (
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-md text-[8px] font-black uppercase flex items-center gap-1">
                                    <MdVerified size={10} /> Verified
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={fetchDashboardStats}
                            className="p-2.5 bg-white rounded-xl border border-slate-100 text-slate-400 hover:text-blue-600 transition-all shadow-sm active:scale-95"
                        >
                            <MdRefresh size={18} className={loadingData ? "animate-spin" : ""} />
                        </button>
                    </div>
                </div>

                {loadingData ? (
                    <div className="py-20 text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                        Updating account status...
                    </div>
                ) : !stats?.hasProfile ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900 rounded-[2.5rem] p-12 text-center space-y-8 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-blue-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/20">
                                <GiReceiveMoney className="text-white text-4xl" />
                            </div>
                            <h2 className="text-4xl font-black text-white tracking-tighter leading-none mb-4">Complete Your<br /> Credit Profile</h2>
                            <p className="text-slate-400 text-sm max-w-md mx-auto font-medium">Unlock up to ₹5,00,000 in credit by completing your financial assessment.</p>
                            <button 
                                onClick={() => navigate("/credit-form")}
                                className="mt-10 px-10 py-5 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-400 hover:text-white transition-all shadow-2xl active:scale-95"
                            >
                                Get Started
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* LEFT COLUMN (4/12) */}
                        <div className="lg:col-span-4 space-y-6">
                            
                            {/* Score Card */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
                                <div className="relative z-10 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">CrediScore</p>
                                        <MdTrendingUp className="text-blue-500" />
                                    </div>
                                    <div className="flex items-baseline justify-center gap-1 py-4">
                                        <span className="text-7xl font-black text-slate-900 tracking-tighter">{crediScore}</span>
                                        <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Pts</span>
                                    </div>
                                    <div className={`w-full py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-center border ${
                                        stats.riskLevel === 'Excellent' || stats.riskLevel === 'Good' 
                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                        : 'bg-amber-50 text-amber-600 border-amber-100'
                                    }`}>
                                        Status: {stats.riskLevel}
                                    </div>
                                    
                                    {/* Dropdown for Score Factors */}
                                    <div className="pt-2">
                                        <button 
                                            onClick={() => setShowScoreAnalysis(!showScoreAnalysis)}
                                            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group/btn"
                                        >
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Score Analysis</span>
                                            {showScoreAnalysis ? <MdKeyboardArrowUp className="text-slate-400" /> : <MdKeyboardArrowDown className="text-slate-400" />}
                                        </button>
                                        <AnimatePresence>
                                            {showScoreAnalysis && (
                                                <motion.div 
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pt-4 space-y-3">
                                                        {stats.breakdown.map((item, i) => (
                                                            <div key={i} className="flex justify-between items-center px-2">
                                                                <span className="text-[9px] font-bold text-slate-400 uppercase">{item.factor}</span>
                                                                <span className={`text-[9px] font-black ${item.score >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                                    {item.score >= 0 ? '+' : ''}{item.score}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Limits & Balance */}
                            <div className="bg-slate-900 rounded-[2rem] p-8 text-white space-y-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12" />
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Credit Limit</p>
                                    </div>
                                    <p className="text-3xl font-black tracking-tighter">{formatCurrency(user.remainingLimit)}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Available Balance</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Total Limit</p>
                                        <p className="text-sm font-black tracking-tight">{formatCurrency(stats.eligibility.maxAmount)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Interest Rate</p>
                                        <p className="text-sm font-black text-emerald-400 tracking-tight">{stats.eligibility.interestRange}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => navigate("/loans")}
                                    className="w-full py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-400 hover:text-white transition-all shadow-xl active:scale-95"
                                >
                                    View Loans
                                </button>
                            </div>
                        </div>

                        {/* RIGHT COLUMN (8/12) */}
                        <div className="lg:col-span-8 space-y-6">
                            
                            {/* Action Center */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {verificationStatus !== "approved" ? (
                                    <div className="bg-blue-600 rounded-[2rem] p-6 text-white space-y-4 shadow-xl shadow-blue-100">
                                        <div className="flex items-center justify-between">
                                            <div className="p-2.5 bg-white/10 rounded-xl"><MdSecurity size={20} /></div>
                                            <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Priority Task</span>
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-black uppercase tracking-tight">Identity Verification</h3>
                                            <p className="text-[10px] font-bold opacity-60">Complete verification to increase your credit limit.</p>
                                        </div>
                                        <button 
                                            onClick={() => navigate("/verify-income")}
                                            className="w-full py-3 bg-white text-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:shadow-lg transition-all"
                                        >
                                            Verify Now
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-emerald-600 rounded-[2rem] p-6 text-white space-y-4 shadow-xl shadow-emerald-100">
                                        <div className="flex items-center justify-between">
                                            <div className="p-2.5 bg-white/10 rounded-xl"><MdVerified size={20} /></div>
                                            <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Verified Status</span>
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-black uppercase tracking-tight">Verified Account</h3>
                                            <p className="text-[10px] font-bold opacity-60">Your profile is fully validated for maximum credit access.</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest">
                                            <MdCheckCircle /> Validation Complete
                                        </div>
                                    </div>
                                )}

                                <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400"><MdLightbulb size={20} /></div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Insights</span>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Financial Tip</h3>
                                        <p className="text-[10px] font-bold text-slate-400">"{stats.insights[0]}"</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                        <MdCheckCircle /> Active Monitoring
                                    </div>
                                </div>
                            </div>

                            {/* Activity */}
                            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-900 rounded-lg text-white"><MdAccountBalanceWallet size={16} /></div>
                                        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Recent Activity</h3>
                                    </div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stats.loans.length} Active Records</span>
                                </div>
                                <div className="divide-y divide-slate-50">
                                    {stats.loans.length > 0 ? stats.loans.map((loan, i) => (
                                        <div key={i} className="p-6 hover:bg-slate-50 transition-all space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-3 rounded-xl ${loan.requestStatus === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                                        <GiProgression size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-tight">{loan.loanType}</h4>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatCurrency(loan.requestedAmount)} • {loan.tenure}M Term</p>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                                    loan.requestStatus === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                                    loan.requestStatus === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                                                    'bg-blue-50 text-blue-600 border-blue-100'
                                                }`}>
                                                    {loan.requestStatus}
                                                </span>
                                            </div>

                                            {loan.requestStatus === 'approved' && (
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-2">
                                                    <div className="space-y-1">
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Monthly EMI</p>
                                                        <p className="text-sm font-black text-slate-900 tracking-tight">{formatCurrency(loan.emi)}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Next Due Date</p>
                                                        <div className="flex items-center gap-1.5">
                                                            <MdCalendarToday className="text-slate-400" size={12} />
                                                            <p className="text-sm font-black text-slate-900 tracking-tight">15th Monthly</p>
                                                        </div>
                                                    </div>
                                                    <button className="col-span-2 sm:col-span-1 py-3 bg-slate-50 text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                                                        Manage Loan
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )) : (
                                        <div className="py-20 text-center space-y-4">
                                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                                                <MdAccountBalanceWallet size={24} />
                                            </div>
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No active records found</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
