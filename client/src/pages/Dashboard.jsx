import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { GiReceiveMoney, GiTrophy } from "react-icons/gi";
import { FaArrowTrendUp } from "react-icons/fa6";
import {
    MdAccountBalanceWallet,
    MdHistory,
    MdCreditScore,
    MdArrowForward,
    MdVerified,
    MdWarning,
    MdError,
    MdReceiptLong,
    MdPayments,
    MdCheckCircle,
    MdCancel,
    MdHourglassTop,
} from "react-icons/md";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";

export default function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const [loanRequests, setLoanRequests] = useState([]); // State for loan history
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/", { replace: true });
        } 
        else if(user.role === "admin"){
            navigate("/admin");
        } 
        else {
            fetchLoanRequests();
        }
    }, [user, navigate]);

    const fetchLoanRequests = async () => {
        try {
            const res = await api.get("/loans/my-requests");
            setLoanRequests(res.data || []);
        } catch (err) {
            console.error("Error fetching loans:", err);
        }
    };

    if (!user) return null;

    const crediScore = user.crediScore || 0;
    const hasCreditScore = crediScore > 0;
    const verificationStatus = user.verificationStatus || "not-started";

    const formatCurrency = (amount) => {
        if (!amount) return "₹0";
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getScoreColor = () => {
        if (crediScore >= 750) return "from-green-500 to-emerald-600";
        if (crediScore >= 700) return "from-emerald-500 to-teal-600";
        if (crediScore >= 650) return "from-blue-500 to-cyan-600";
        if (crediScore >= 600) return "from-yellow-500 to-amber-600";
        return "from-gray-400 to-gray-600";
    };

    const getScoreLabel = () => {
        if (crediScore >= 750) return "Excellent";
        if (crediScore >= 700) return "Very Good";
        if (crediScore >= 650) return "Good";
        if (crediScore >= 600) return "Fair";
        return "Build Your Score";
    };

    // Status Badge Helper
    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case "approved":
                return (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-bold border border-green-200">
                        <MdCheckCircle /> Approved
                    </div>
                );
            case "rejected":
                return (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 font-bold border border-red-200">
                        <MdCancel /> Rejected
                    </div>
                );
            default:
                return (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 font-bold border border-amber-200">
                        <MdHourglassTop className="animate-pulse" /> Pending
                    </div>
                );
        }
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-linear-to-br from-blue-50 to-green-50">

            {/* Main Content - Internal Scroll only */}
            <div className="flex-1 overflow-y-auto pt-8 pb-12 px-6 scrollbar-hide">
                <div className="max-w-7xl mx-auto">
                    {hasCreditScore ? (
                        <>
                            {/* CrediScore Card */}
                            <div
                                className={`bg-linear-to-r ${getScoreColor()} rounded-3xl shadow-2xl p-8 text-white mb-10`}
                            >
                                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div>
                                        <h2 className="text-2xl font-medium mb-2">
                                            Your CrediScore
                                        </h2>
                                        <div className="text-7xl font-extrabold">{crediScore}</div>
                                        <p className="text-2xl mt-3 opacity-95">
                                            {getScoreLabel()} •{" "}
                                            {verificationStatus === "approved"
                                                ? "Income Verified"
                                                : "Basic Scoring"}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8">
                                            <GiTrophy className="text-7xl mx-auto mb-3" />
                                            <p className="text-xl font-bold">Strong Profile!</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Verification Status Banner */}
                            <div className="mb-8">
                                {verificationStatus === "pending" && (
                                    <div className="bg-orange-50 border-2 border-orange-300 rounded-2xl p-6 flex items-center justify-between shadow-lg">
                                        <div className="flex items-center gap-4">
                                            <MdWarning className="text-5xl text-orange-600" />
                                            <div>
                                                <h3 className="text-2xl font-bold text-orange-800">
                                                    Income Verification Pending
                                                </h3>
                                                <p className="text-lg text-orange-700 mt-1">
                                                    Your verification is under review. You'll be
                                                    notified once approved.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {verificationStatus === "approved" && (
                                    <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-6 flex items-center justify-between shadow-lg">
                                        <div className="flex items-center gap-4">
                                            <MdVerified className="text-5xl text-green-600" />
                                            <div>
                                                <h3 className="text-2xl font-bold text-green-800">
                                                    Income Verified
                                                </h3>
                                                <p className="text-lg text-green-700 mt-1">
                                                    Your income has been successfully verified.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {verificationStatus === "not-started" && (
                                    <div className="bg-orange-50 border-2 border-orange-300 rounded-2xl p-6 flex items-center justify-between shadow-lg">
                                        <div className="flex items-center gap-4">
                                            <MdWarning className="text-5xl text-orange-600" />
                                            <div>
                                                <h3 className="text-2xl font-bold text-orange-800">
                                                    Complete Income Verification
                                                </h3>
                                                <p className="text-lg text-orange-700 mt-1">
                                                    Verify your income to unlock higher credit
                                                    limits and better scoring.
                                                </p>
                                            </div>
                                        </div>
                                        <NavLink to="/verify-income">
                                            <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-md transition flex items-center gap-3">
                                                Verify Income Now
                                                <MdArrowForward className="text-2xl" />
                                            </button>
                                        </NavLink>
                                    </div>
                                )}

                                {verificationStatus === "rejected" && (
                                    <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 flex items-center justify-between shadow-lg">
                                        <div className="flex items-center gap-4">
                                            <MdError className="text-5xl text-red-600" />
                                            <div>
                                                <h3 className="text-2xl font-bold text-red-800">
                                                    Verification Rejected
                                                </h3>
                                                <p className="text-lg text-red-700 mt-1">
                                                    Your submitted documents were not approved.
                                                    Please try again.
                                                </p>
                                            </div>
                                        </div>
                                        <NavLink to="/verify-income">
                                            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-md transition">
                                                Re-submit Verification
                                            </button>
                                        </NavLink>
                                    </div>
                                )}
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-lg">Total Credit Limit</p>
                                        <p className="text-4xl font-bold text-gray-800 mt-2">
                                            {formatCurrency(user.creditLimit || 0)}
                                        </p>
                                    </div>
                                    <MdAccountBalanceWallet className="text-6xl text-blue-600 opacity-80" />
                                </div>
                                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-lg">Remaining Limit</p>
                                        <p className="text-4xl font-bold text-green-600 mt-2">
                                            {formatCurrency(user.remainingLimit || 0)}
                                        </p>
                                    </div>
                                    <FaArrowTrendUp className="text-6xl text-green-600 opacity-80" />
                                </div>
                                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-lg">Loan Requests</p>
                                        <p className="text-4xl font-bold text-indigo-600 mt-2">
                                            {loanRequests.length}
                                        </p>
                                    </div>
                                    <MdReceiptLong className="text-6xl text-indigo-600 opacity-80" />
                                </div>
                            </div>

                            {/* Section: Active Loans / Applications */}
                            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 mb-12">
                                <div className="flex items-center gap-3 mb-8">
                                    <MdPayments className="text-4xl text-blue-600" />
                                    <h3 className="text-3xl font-extrabold text-gray-800">
                                        Your Loan Applications
                                    </h3>
                                </div>

                                {loanRequests.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        {loanRequests.map((loan) => (
                                            <div
                                                key={loan._id}
                                                className="bg-gray-50 rounded-2xl p-6 border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6 transition hover:border-blue-300"
                                            >
                                                {/* 1. Icon & Title Section - Fixed Width for Alignment */}
                                                <div className="flex items-center gap-6 md:w-1/3 shrink-0">
                                                    <div
                                                        className={`p-4 rounded-xl shrink-0 ${
                                                            loan.requestStatus === "rejected"
                                                                ? "bg-red-100 text-red-600"
                                                                : "bg-blue-100 text-blue-600"
                                                        }`}
                                                    >
                                                        <GiReceiveMoney className="text-3xl" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="text-xl font-bold text-gray-800 truncate">
                                                            {loan.loanType}
                                                        </h4>
                                                        <p className="text-gray-500 font-mono text-xs">
                                                            ID: {loan._id.slice(-8).toUpperCase()}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* 2. Stats Grid - Fixed Width and Flex-1 for Alignment */}
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm flex-1">
                                                    <div>
                                                        <p className="text-gray-400 font-bold uppercase">
                                                            Amount
                                                        </p>
                                                        <p className="text-lg font-bold">
                                                            {formatCurrency(loan.requestedAmount)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-400 font-bold uppercase">
                                                            Tenure
                                                        </p>
                                                        <p className="text-lg font-bold">
                                                            {loan.tenure} Mo.
                                                        </p>
                                                    </div>
                                                    <div className="hidden md:block">
                                                        <p className="text-gray-400 font-bold uppercase">
                                                            Interest
                                                        </p>
                                                        <p className="text-lg font-bold text-green-600">
                                                            {loan.interestRate}%
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* 3. Status Section - Fixed Width for Alignment */}
                                                <div className="w-full md:w-48 flex md:justify-end">
                                                    {getStatusBadge(loan.requestStatus)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-3xl">
                                        <p className="text-xl text-gray-500">
                                            No loan applications found.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        /* No Score Yet section - Kept exactly as provided */
                        /* RESTORED FULL "NO SCORE YET" SECTION */
                        <div className="text-center h-full flex items-center justify-center">
                            <div className="max-w-3xl mx-auto">
                                <MdCreditScore className="text-9xl text-gray-300 mx-auto mb-10" />
                                <h2 className="text-5xl font-extrabold text-gray-800 mb-8">
                                    Unlock Your CrediScore Now
                                </h2>
                                <p className="text-2xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
                                    Complete your credit profile with income, employment, and KYC
                                    details to get your real, income-based CrediScore instantly.
                                    <br />
                                    No CIBIL or traditional credit history required.
                                </p>
                                <NavLink to="/credit-form">
                                    <button className="bg-linear-to-r from-blue-600 to-green-600 text-white px-16 py-8 rounded-3xl text-3xl font-bold shadow-2xl hover:scale-110 transition flex items-center gap-4 mx-auto">
                                        Complete Credit Profile
                                        <MdArrowForward className="text-4xl" />
                                    </button>
                                </NavLink>
                                <p className="text-lg text-gray-500 mt-10">
                                    Takes less than 3 minutes • 100% secure • Instant results
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer - Shrink-0 keeps it visible */}
            <footer className="shrink-0 py-6 text-center text-gray-400 text-xs border-t border-gray-200 bg-white">
                © {new Date().getFullYear()} CrediScore • Digital Lending • RBI Guidelines Compliant
            </footer>
        </div>
    );
}




