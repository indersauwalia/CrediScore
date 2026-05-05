import React from "react";
import { GiReceiveMoney } from "react-icons/gi";
import { FaCircleCheck, FaBrain } from "react-icons/fa6";
import { FaFileAlt } from "react-icons/fa";
import { MdSecurity, MdSwapHoriz } from "react-icons/md";
import LoanImgHomepage from "../assets/LoanImgHomepage.png";
import { NavLink } from "react-router";
import { motion } from "framer-motion";

export default function Home() {
    return (
        <div className="w-full min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Subtle background improvements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-0 left-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-emerald-100/40 rounded-full blur-[100px]" />
            </div>

            <nav className="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-[90%] max-w-5xl">
                <div className="bg-white/80 backdrop-blur-lg border border-slate-100 rounded-2xl shadow-xl px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 bg-slate-900 rounded-lg shadow-sm">
                            <GiReceiveMoney className="text-white text-lg sm:text-xl" />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tighter">
                            CrediScore
                        </h1>
                    </div>
                    <div className="flex gap-3 sm:gap-4 text-sm sm:text-base">
                        <NavLink
                            to="/login"
                            className="py-2 text-center max-sm:hidden text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-slate-900 transition"
                        >
                            Login
                        </NavLink>
                        <NavLink to="/signup" className="bg-slate-900 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:shadow-lg hover:bg-blue-600 transition active:scale-95">
                            Get Started
                        </NavLink>
                    </div>
                </div>
            </nav>

            <section className="relative pt-32 sm:pt-40 pb-12 sm:pb-20 px-6 text-center z-10">
                <div className="max-w-4xl mx-auto space-y-6">
                    <motion.h1 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-tight tracking-tighter"
                    >
                        Instant Loans with
                        <br />
                        <span className="text-blue-600">
                            Real Income Verification
                        </span>
                    </motion.h1>
                    <p className="mt-6 text-lg sm:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
                        Forget old CIBIL scores. We verify your <strong>actual income</strong> and approve loans in <strong>under 5 minutes</strong>.
                    </p>
                    <div className="mt-8 sm:mt-10">
                        <NavLink to="/signup" className="bg-slate-900 text-white px-10 sm:px-12 py-4 sm:py-5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl hover:bg-blue-600 hover:scale-105 transition inline-block">
                            Apply Now → Free
                        </NavLink>
                    </div>
                </div>
            </section>

            <section className="py-16 sm:py-20 px-6 bg-white relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-10 lg:gap-12 items-center">
                        <div className="space-y-6 sm:space-y-7 order-2 md:order-1">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tighter">
                                Know Before You Apply
                            </h2>
                            <p className="text-base sm:text-lg text-slate-500 font-medium">
                                We don't reject applications blindly. First check your real
                                income-based CrediScore. Only eligible users are invited to apply.
                            </p>

                            <div className="space-y-4 sm:space-y-5">
                                {[
                                    "Enter basic details & check score instantly",
                                    "If eligible → Upload bank statements",
                                    "We verify income → Approved & Disbursed",
                                ].map((text, i) => (
                                    <div key={i} className="flex items-start gap-3 sm:gap-4">
                                        <FaCircleCheck className="text-xl sm:text-2xl text-emerald-500 mt-1 shrink-0" />
                                        <div className="text-sm font-bold text-slate-600">
                                            <strong className="text-slate-900">Step {i + 1}:</strong> {text}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <NavLink to="/signup" className="mt-6 bg-slate-50 text-slate-900 border border-slate-100 px-8 sm:px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm hover:bg-slate-100 transition inline-block">
                                Check Eligibility Now
                            </NavLink>
                        </div>

                        <div className="order-1 md:order-2 flex justify-center">
                            <div className="relative w-full max-w-sm sm:max-w-md">
                                <img
                                    src={LoanImgHomepage}
                                    alt="CrediScore Dashboard"
                                    className="w-full rounded-[2rem] shadow-2xl border border-slate-100"
                                />
                                <div className="absolute -bottom-4 sm:-bottom-5 -right-4 sm:-right-5 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl font-black text-xs uppercase tracking-widest">
                                    Score in 30 sec
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 sm:py-24 bg-slate-900 text-white relative z-10">
                <div className="max-w-5xl mx-auto text-center px-6 space-y-8">
                    <h2 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tighter">
                        We Don't Trust CIBIL.<br /> We Verify Your Income.
                    </h2>
                    <p className="text-lg sm:text-xl text-slate-400 font-medium max-w-3xl mx-auto">
                        Our AI reads your last 6 months bank statements, detects salary credits, and gives you a <strong>true credit score</strong> based on actual cash flow.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-12">
                        {[
                            "Salary Credits Detected",
                            "Gig Income Accepted",
                            "No History Needed",
                        ].map((text) => (
                            <div
                                key={text}
                                className="bg-white/5 backdrop-blur-sm p-6 sm:p-8 rounded-[2rem] border border-white/10"
                            >
                                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                                    ✓
                                </div>
                                <p className="text-xs font-black uppercase tracking-widest">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 sm:py-24 px-6 bg-slate-50 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl sm:text-5xl font-black text-center mb-12 sm:mb-16 text-slate-900 tracking-tighter">
                        Why CrediScore is Different
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Easy Apply", icon: FaCircleCheck },
                            { title: "100% Paperless", icon: FaFileAlt },
                            { title: "Up to ₹5 Lakh", icon: GiReceiveMoney },
                            { title: "No Hidden Fees", icon: MdSecurity },
                            { title: "Direct Transfer", icon: MdSwapHoriz },
                            { title: "Fair AI Scoring", icon: FaBrain },
                        ].map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={feature.title}
                                    className="bg-white p-8 rounded-[2rem] shadow-sm text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 group"
                                >
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-900 text-3xl group-hover:bg-slate-900 group-hover:text-white transition-all">
                                        <Icon />
                                    </div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                                        {feature.title}
                                    </h3>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="py-20 sm:py-24 px-6 text-center bg-white border-t border-slate-100 relative z-10">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                        Need Money Right Now?
                    </h2>
                    <NavLink to="/signup" className="bg-slate-900 text-white px-10 sm:px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl hover:bg-blue-600 transition inline-block active:scale-95">
                        Apply Now →
                    </NavLink>
                    <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Zero processing fee • No traditional score needed
                    </p>
                </div>
            </section>

            <footer className="py-12 bg-slate-900 text-slate-500 text-center relative z-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="p-1.5 bg-white/10 rounded-lg">
                        <GiReceiveMoney className="text-white text-lg" />
                    </div>
                    <h1 className="text-lg font-black text-white uppercase tracking-tighter">
                        CrediScore
                    </h1>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-50">© {new Date().getFullYear()} CrediScore • Income-First Digital Lending</p>
                <p className="mt-2 text-[9px] font-bold uppercase tracking-widest opacity-30">Privacy Protected • RBI Guidelines Compliant</p>
            </footer>
        </div>
    );
}
