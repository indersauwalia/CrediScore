// pages/Dashboard.jsx
import React, { useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { GiReceiveMoney, GiTrophy, GiShield } from "react-icons/gi";
import { FaArrowTrendUp } from "react-icons/fa6";
import { MdAccountBalanceWallet, MdHistory, MdCreditScore, MdArrowForward } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Redirect to home if not logged in
    useEffect(() => {
        if (!user) {
            navigate("/", { replace: true });
        }
    }, [user, navigate]);

    if (!user) {
        return null; // Or a loading spinner while redirecting
    }

    const crediScore = user.crediScore || 0;
    const hasCreditScore = crediScore > 0;

    // Dynamic calculations
    const getAvailableCredit = () => {
        if (crediScore >= 750) return "₹2,50,000";
        if (crediScore >= 700) return "₹2,00,000";
        if (crediScore >= 650) return "₹1,50,000";
        if (crediScore >= 600) return "₹1,00,000";
        return "₹50,000";
    };

    const getEligibilityMessage = () => {
        if (crediScore >= 700) return "Excellent! You're pre-approved for premium loans";
        if (crediScore >= 650) return "Great! Eligible for instant digital loans";
        if (crediScore >= 600) return "Good! You qualify for standard loans";
        return "Complete your profile to unlock loan eligibility";
    };

    const getScoreLabel = () => {
        if (crediScore >= 700) return "Excellent";
        if (crediScore >= 650) return "Very Good";
        if (crediScore >= 600) return "Good";
        return "Build Your Score";
    };

    const getScoreColor = () => {
        if (crediScore >= 700) return "from-green-500 to-emerald-600";
        if (crediScore >= 650) return "from-blue-500 to-cyan-600";
        if (crediScore >= 600) return "from-yellow-500 to-orange-600";
        return "from-gray-400 to-gray-600";
    };

    const handleLogout = () => {
        logout(); // This already removes token, sets user null, navigates to /login
        navigate("/", { replace: true }); // Force redirect to home
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-white/30">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                            <GiReceiveMoney className="text-white text-2xl" />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                            CrediScore
                        </h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="text-sm text-gray-600 font-medium">
                            Welcome, {user.name || "User"}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full text-sm font-medium transition shadow-md"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="pt-24 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    {hasCreditScore ? (
                        <>
                            {/* CrediScore Card */}
                            <div
                                className={`bg-gradient-to-r ${getScoreColor()} rounded-3xl shadow-2xl p-8 text-white mb-10`}
                            >
                                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div>
                                        <h2 className="text-2xl font-medium mb-2">
                                            Your CrediScore
                                        </h2>
                                        <div className="text-7xl font-extrabold">{crediScore}</div>
                                        <p className="text-2xl mt-3 opacity-95">
                                            {getScoreLabel()} • Income Verified Scoring
                                        </p>
                                        <p className="text-lg mt-2 opacity-90">
                                            {getEligibilityMessage()}
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

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-600 text-lg">
                                                Available Credit Limit
                                            </p>
                                            <p className="text-4xl font-bold text-gray-800 mt-2">
                                                {getAvailableCredit()}
                                            </p>
                                        </div>
                                        <MdAccountBalanceWallet className="text-6xl text-blue-600 opacity-80" />
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-600 text-lg">
                                                Loan Eligibility
                                            </p>
                                            <p className="text-4xl font-bold text-green-600 mt-2">
                                                Approved
                                            </p>
                                        </div>
                                        <FaArrowTrendUp className="text-6xl text-green-600 opacity-80" />
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-600 text-lg">Next Step</p>
                                            <p className="text-2xl font-bold text-gray-800 mt-2">
                                                Apply for Loan
                                            </p>
                                        </div>
                                        <GiShield className="text-6xl text-purple-600 opacity-80" />
                                    </div>
                                </div>
                            </div>

                            {/* Apply CTA */}
                            <div className="text-center mb-12">
                                <h3 className="text-4xl font-extrabold text-gray-800 mb-6">
                                    Get Instant Digital Loan Today
                                </h3>
                                <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-16 py-6 rounded-2xl text-2xl font-bold shadow-2xl hover:scale-105 transition">
                                    Apply Now →
                                </button>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                                <h3 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-4">
                                    <MdHistory className="text-4xl text-blue-600" />
                                    Recent Activity
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-6 py-4 border-b border-gray-100">
                                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                            <FaArrowTrendUp className="text-2xl text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-lg font-medium text-gray-800">
                                                Credit Profile Completed
                                            </p>
                                            <p className="text-gray-500">
                                                Your details have been verified
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-500">Just now</p>
                                    </div>
                                    <div className="flex items-center gap-6 py-4 border-b border-gray-100">
                                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                            <GiTrophy className="text-2xl text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-lg font-medium text-gray-800">
                                                CrediScore Generated
                                            </p>
                                            <p className="text-gray-500">
                                                Score: {crediScore} ({getScoreLabel()})
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-500">Today</p>
                                    </div>
                                    <div className="flex items-center gap-6 py-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                            <MdAccountBalanceWallet className="text-2xl text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-lg font-medium text-gray-800">
                                                Credit Limit Activated
                                            </p>
                                            <p className="text-gray-500">
                                                Up to {getAvailableCredit()} available
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-500">Today</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* No Score Yet - Prompt */
                        <div className="text-center py-32">
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
                                    <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-16 py-8 rounded-3xl text-3xl font-bold shadow-2xl hover:scale-110 transition flex items-center gap-4 mx-auto">
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

            {/* Footer */}
            <footer className="py-10 text-center text-gray-500 text-sm border-t border-gray-200">
                © {new Date().getFullYear()} CrediScore • Income-First Digital Lending • RBI
                Guidelines Compliant
            </footer>
        </div>
    );
}