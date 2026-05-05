import { useState, useMemo } from "react";
import { MdCalculate, MdInfoOutline, MdAccountBalanceWallet, MdTimeline, MdPercent } from "react-icons/md";
import { motion } from "framer-motion";

const EMICalculator = ({ loanDetails, onCalculate }) => {
    const [principal, setPrincipal] = useState(loanDetails?.maxAmount || 50000);
    const [tenure, setTenure] = useState(12);
    const [interestRate, setInterestRate] = useState(loanDetails?.interestRate || 12);

    const calculations = useMemo(() => {
        const p = parseFloat(principal);
        const r = parseFloat(interestRate) / 100 / 12;
        const n = parseInt(tenure);

        if (p <= 0 || r <= 0 || n <= 0) return { emi: 0, total: 0, interest: 0 };

        const emiVal = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalVal = emiVal * n;
        const interestVal = totalVal - p;

        return {
            emi: emiVal.toFixed(0),
            total: totalVal.toFixed(0),
            interest: interestVal.toFixed(0)
        };
    }, [principal, tenure, interestRate]);

    return (
        <div className="bg-white rounded-[2rem] shadow-xl p-6 md:p-10 border border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 mb-1 flex items-center gap-2">
                        <div className="p-2 bg-slate-900 rounded-xl text-white shadow-md">
                            <MdCalculate size={20} />
                        </div>
                        EMI Calculator
                    </h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Precision Planning Tool</p>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                    <MdInfoOutline className="text-blue-500" />
                    Standard Formula applied
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Sliders Section */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <MdAccountBalanceWallet className="text-blue-500" />
                                Principal
                            </label>
                            <span className="text-xl font-black text-slate-900">₹{Number(principal).toLocaleString()}</span>
                        </div>
                        <input
                            type="range"
                            min={5000}
                            max={1000000}
                            step={5000}
                            value={principal}
                            onChange={(e) => setPrincipal(e.target.value)}
                            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                        />
                        <div className="flex justify-between text-[8px] font-bold text-slate-300 uppercase tracking-widest">
                            <span>₹5k</span>
                            <span>₹10L</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <MdTimeline className="text-indigo-500" />
                                Duration
                            </label>
                            <span className="text-xl font-black text-slate-900">{tenure} <span className="text-xs text-slate-400">Mo</span></span>
                        </div>
                        <input
                            type="range"
                            min={3}
                            max={60}
                            step={1}
                            value={tenure}
                            onChange={(e) => setTenure(e.target.value)}
                            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                        />
                        <div className="flex justify-between text-[8px] font-bold text-slate-300 uppercase tracking-widest">
                            <span>3 Mo</span>
                            <span>60 Mo</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <MdPercent className="text-emerald-500" />
                                Rate
                            </label>
                            <span className="text-xl font-black text-slate-900">{interestRate}% <span className="text-[10px] text-slate-400 font-medium">p.a.</span></span>
                        </div>
                        <input
                            type="range"
                            min={5}
                            max={24}
                            step={0.5}
                            value={interestRate}
                            onChange={(e) => setInterestRate(e.target.value)}
                            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                        />
                        <div className="flex justify-between text-[8px] font-bold text-slate-300 uppercase tracking-widest">
                            <span>5%</span>
                            <span>24%</span>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-12 -mt-12"></div>
                    
                    <div className="relative z-10">
                        <p className="text-slate-500 font-black uppercase tracking-widest text-[9px] mb-2">Monthly Installment</p>
                        <motion.div 
                            key={calculations.emi}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl font-black text-white mb-8 tracking-tighter"
                        >
                            ₹{Number(calculations.emi).toLocaleString()}
                        </motion.div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <span className="text-slate-500 font-black uppercase tracking-widest text-[9px]">Principal</span>
                                <span className="text-sm font-black">₹{Number(principal).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <span className="text-slate-500 font-black uppercase tracking-widest text-[9px]">Total Interest</span>
                                <span className="text-sm font-black text-emerald-400">₹{Number(calculations.interest).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center pt-3">
                                <span className="text-slate-300 font-black uppercase tracking-widest text-[9px]">Total Payable</span>
                                <span className="text-xl font-black text-blue-400 tracking-tighter">₹{Number(calculations.total).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <button 
                        className="mt-8 w-full py-3.5 bg-white text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all shadow-lg active:scale-95"
                        onClick={() => alert("Explore available loans in the marketplace!")}
                    >
                        Explore Marketplace
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EMICalculator;