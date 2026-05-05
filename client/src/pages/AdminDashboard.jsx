import { useContext, useEffect, useState } from "react";
import { GiReceiveMoney } from "react-icons/gi";
import { MdPendingActions, MdVerified, MdClose, MdPerson, MdTimer } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";

export default function AdminDashboard() {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("income");
    const [incomeRequests, setIncomeRequests] = useState([]);
    const [loanRequests, setLoanRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [incomeRes, loanRes] = await Promise.all([
                    fetch("/api/admin/pending-income"),
                    fetch("/api/admin/pending-loans"),
                ]);

                if (!incomeRes.ok || !loanRes.ok) {
                    throw new Error("Failed to fetch data");
                }

                const incomeData = await incomeRes.json();
                const loanData = await loanRes.json();

                setIncomeRequests(incomeData.requests || []);
                setLoanRequests(loanData.requests || []);
            } catch (err) {
                console.error("Error fetching admin data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleIncomeAction = async (requestId, action, note = "") => {
        try {
            const res = await fetch(`/api/admin/income-${action}/${requestId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ adminNote: note }),
            });

            if (res.ok) {
                setIncomeRequests((prev) => prev.filter((r) => r._id !== requestId));
            }
        } catch (err) {
            console.error("Action failed:", err);
        }
    };

    const handleLoanAction = async (requestId, action, note = "") => {
        try {
            const res = await fetch(`/api/admin/loan-${action}/${requestId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ adminNote: note }),
            });

            if (res.ok) {
                setLoanRequests((prev) => prev.filter((r) => r._id !== requestId));
            }
        } catch (err) {
            console.error("Action failed:", err);
        }
    };

    if (loading) {
        return (
            <div className="py-20 text-center text-slate-400 font-black uppercase tracking-widest text-[10px] animate-pulse">
                Loading administrative data...
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-900 rounded-xl text-white">
                            <MdPendingActions size={20} />
                        </div>
                        <div>
                            <h1 className="text-sm font-black text-slate-900 uppercase tracking-widest">Admin Control</h1>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Administrative Overview</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab("income")}
                            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                                activeTab === "income" ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"
                            }`}
                        >
                            Verifications ({incomeRequests.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("loans")}
                            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                                activeTab === "loans" ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"
                            }`}
                        >
                            Loan Queue ({loanRequests.length})
                        </button>
                    </div>
                </div>

                {/* Table Layout */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Subject</th>
                                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Core Metrics</th>
                                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Documents</th>
                                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Timeline</th>
                                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {activeTab === "income" ? (
                                    incomeRequests.map((req) => (
                                        <tr key={req._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                                        <MdPerson size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-black text-slate-900 uppercase leading-none">{req.user?.name}</p>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">{req.income?.pan || "PAN NOT PROVIDED"}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-[11px] font-black text-slate-900 tracking-tight">₹{req.income?.monthlyIncome?.toLocaleString()}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Income Profile</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <a
                                                    href={`/api/admin/view-proof/${req.income._id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                                                >
                                                    View Statement
                                                </a>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase">
                                                    <MdTimer size={12} />
                                                    {new Date(req.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleIncomeAction(req._id, "approve")} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors shadow-sm"><MdVerified size={16} /></button>
                                                    <button onClick={() => handleIncomeAction(req._id, "reject")} className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors shadow-sm"><MdClose size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    loanRequests.map((req) => (
                                        <tr key={req._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                                        <GiReceiveMoney size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-black text-slate-900 uppercase leading-none">{req.user?.name}</p>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">{req.loanType}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-[11px] font-black text-slate-900 tracking-tight">₹{req.requestedAmount?.toLocaleString()}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{req.tenure}M @ {req.interestRate}%</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Digital Auth</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase">
                                                    <MdTimer size={12} />
                                                    {new Date(req.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleLoanAction(req._id, "approve")} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors shadow-sm"><MdVerified size={16} /></button>
                                                    <button onClick={() => handleLoanAction(req._id, "reject")} className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors shadow-sm"><MdClose size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        {((activeTab === "income" && incomeRequests.length === 0) || (activeTab === "loans" && loanRequests.length === 0)) && (
                            <div className="py-20 text-center">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Queue is clear</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
