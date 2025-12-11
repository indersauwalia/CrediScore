// pages/Dashboard.jsx
import React from "react";
import { GiReceiveMoney, GiTrophy, GiShield } from "react-icons/gi";
import { FaArrowTrendUp } from "react-icons/fa6";
import { MdAccountBalanceWallet, MdHistory, MdCreditScore } from "react-icons/md";
import LoanImgLoginpage from "../assets/LoanImgLoginpage.png";

export default function Dashboard() {
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
                        <span className="text-sm text-gray-600">Welcome, Rahul</span>
                        <button className="bg-red-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-red-600 transition">
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="pt-24 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* CrediScore Card */}
                    <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl shadow-2xl p-8 text-white mb-10">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div>
                                <h2 className="text-2xl font-medium mb-2">Your CrediScore</h2>
                                <div className="text-6xl font-extrabold">742</div>
                                <p className="text-xl mt-2 opacity-90">
                                    Excellent • Up 38 from last month
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 inline-block">
                                    <GiTrophy className="text-6xl mx-auto mb-2" />
                                    <p className="text-lg font-semibold">Top 12% users</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Available Credit</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-1">
                                        ₹1,85,000
                                    </p>
                                </div>
                                <MdAccountBalanceWallet className="text-5xl text-blue-600 opacity-80" />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Active Loans</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-1">1</p>
                                </div>
                                <FaArrowTrendUp className="text-5xl text-green-600 opacity-80" />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Next EMI</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-1">₹8,420</p>
                                    <p className="text-sm text-gray-500 mt-1">Due on 15 Jan</p>
                                </div>
                                <GiShield className="text-5xl text-purple-600 opacity-80" />
                            </div>
                        </div>
                    </div>

                    {/* Apply for Loan CTA */}
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-extrabold text-gray-800 mb-4">
                            Need More Credit?
                        </h3>
                        <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-12 py-5 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-blue-500/30 hover:scale-105 transition">
                            Apply for New Loan →
                        </button>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                            <MdHistory className="text-3xl text-blue-600" />
                            Recent Activity
                        </h3>
                        <div className="space-y-4">
                            {[
                                {
                                    text: "₹50,000 loan approved",
                                    date: "Dec 5, 2025",
                                    positive: true,
                                },
                                {
                                    text: "EMI paid successfully",
                                    date: "Dec 1, 2025",
                                    positive: true,
                                },
                                {
                                    text: "CrediScore updated",
                                    date: "Nov 28, 2025",
                                    positive: true,
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                item.positive ? "bg-green-100" : "bg-red-100"
                                            }`}
                                        >
                                            {item.positive ? (
                                                <FaArrowTrendUp className="text-green-600" />
                                            ) : (
                                                <FaArrowTrendUp className="text-red-600 rotate-180" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{item.text}</p>
                                            <p className="text-sm text-gray-500">{item.date}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-200">
                © {new Date().getFullYear()} CrediScore • Income-First Digital Lending • RBI
                Guidelines Compliant
            </footer>
        </div>
    );
}
