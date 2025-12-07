import React from "react";
import { GiReceiveMoney } from "react-icons/gi";
import { FaCircleCheck, FaBrain } from "react-icons/fa6";
import { FaFileAlt } from "react-icons/fa";
import { MdSecurity, MdSwapHoriz } from "react-icons/md";
import LoanImgHomepage from "../assets/LoanImgHomepage.png";

export default function Home() {
    return (
        <div className="w-full min-h-screen bg-linear-to-b from-blue-50 to-white">
            {/* NAVBAR - Fully Responsive */}
            <nav className="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-[90%] max-w-5xl">
                <div className="bg-white/80 backdrop-blur-lg border border-white/30 rounded-full shadow-xl px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-2 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl">
                            <GiReceiveMoney className="text-white text-xl sm:text-2xl" />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                            CrediScore
                        </h1>
                    </div>
                    <div className="flex gap-3 sm:gap-4 text-sm sm:text-base">
                        <button className="max-sm:hidden text-gray-700 font-medium hover:text-blue-600 transition">
                            Login
                        </button>
                        <button className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition text-sm sm:text-base">
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* HERO SECTION - Mobile First */}
            <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                        Instant Loans with
                        <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-green-600">
                            Real Income Verification
                        </span>
                    </h1>
                    <p className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed">
                        Forget old CIBIL scores. We verify your <strong>actual income</strong> from
                        bank statements
                        <br className="hidden sm:block" />
                        and approve loans in <strong>under 5 minutes</strong>.
                    </p>
                    <div className="mt-8 sm:mt-10">
                        <button className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-10 sm:px-12 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-bold shadow-2xl hover:shadow-blue-500/30 hover:scale-105 transition">
                            Apply Now → Free
                        </button>
                    </div>
                    <p className="mt-8 sm:mt-12 text-base sm:text-lg text-gray-600 flex flex-wrap justify-center gap-x-6 gap-y-2">
                        <span className="flex items-center gap-2">
                            <span className="text-green-600 font-bold text-xl">✓</span> No paperwork
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="text-green-600 font-bold text-xl">✓</span> 100% online
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="text-green-600 font-bold text-xl">✓</span> Money in
                            bank instantly
                        </span>
                    </p>
                </div>
            </section>

            {/* IMAGE + TEXT SECTION - Super Responsive */}
            <section className="py-16 sm:py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-10 lg:gap-12 items-center">
                        {/* Text - Mobile First */}
                        <div className="space-y-6 sm:space-y-7 order-2 md:order-1">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
                                Know Before You Apply
                            </h2>
                            <p className="text-base sm:text-lg md:text-xl text-gray-600">
                                We don’t reject applications blindly. First check your real
                                income-based CrediScore. Only eligible users are invited to apply —
                                saving your time and improving approval chances.
                            </p>

                            <div className="space-y-4 sm:space-y-5">
                                {[
                                    "Enter basic details & check your CrediScore instantly",
                                    "If eligible → Apply & upload bank statements",
                                    "We verify income → Approve & transfer money",
                                ].map((text, i) => (
                                    <div key={i} className="flex items-start gap-3 sm:gap-4">
                                        <FaCircleCheck className="text-2xl sm:text-3xl text-green-600 mt-1 flex-shrink-0" />
                                        <div>
                                            <strong>Step {i + 1}:</strong> {text}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="mt-6 bg-linear-to-r from-blue-600 to-blue-700 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-bold shadow-xl hover:scale-105 transition">
                                Check Eligibility Now
                            </button>
                        </div>

                        {/* Single Image - Responsive */}
                        <div className="order-1 md:order-2 flex justify-center">
                            <div className="relative w-full max-w-sm sm:max-w-md">
                                <img
                                    src={LoanImgHomepage}
                                    alt="Check your CrediScore instantly"
                                    className="w-full rounded-3xl shadow-2xl border border-gray-200"
                                />
                                <div className="absolute -bottom-4 sm:-bottom-5 -right-4 sm:-right-5 bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-2xl font-bold text-lg sm:text-xl">
                                    Score in 30 sec
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Rest of your sections (Income USP, Features, etc.) remain the same */}
            {/* Just make sure to add similar responsive classes if needed */}

            {/* INCOME VERIFICATION USP */}
            <section className="py-16 sm:py-20 bg-linear-to-r from-blue-600 to-blue-800 text-white">
                <div className="max-w-5xl mx-auto text-center px-6">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                        We Don't Trust CIBIL.
                        <br className="sm:hidden" /> We Verify Your Real Income.
                    </h2>
                    <p className="text-lg sm:text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
                        Our AI reads your last 6 months bank statements, detects salary credits, gig
                        payments, and gives you a <strong>true credit score</strong> based on actual
                        cash flow.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-12">
                        {[
                            "Salary Credits Detected",
                            "Gig & Freelance Income Accepted",
                            "No Traditional Score Needed",
                        ].map((text) => (
                            <div
                                key={text}
                                className="bg-white/10 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-white/20"
                            >
                                <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                                    ✓
                                </div>
                                <p className="text-base sm:text-lg font-medium">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES - Responsive Grid */}
            <section className="py-16 sm:py-20 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-16 text-gray-800">
                        Why CrediScore is Different
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Easy Apply", icon: FaCircleCheck },
                            { title: "100% Paperless", icon: FaFileAlt },
                            { title: "Up to ₹5 Lakh Loan", icon: GiReceiveMoney },
                            { title: "No Hidden Fees", icon: MdSecurity },
                            { title: "Direct Bank Transfer", icon: MdSwapHoriz },
                            { title: "Fair AI Scoring", icon: FaBrain },
                        ].map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={feature.title}
                                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 group"
                                >
                                    <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl shadow-lg group-hover:scale-110 transition-transform">
                                        <Icon />
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                        Powered by income verification AI
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS - Responsive */}
            <section className="py-16 sm:py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 sm:mb-16 text-gray-800">
                        Get Loan in 3 Simple Steps
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12">
                        {[
                            { step: "1", title: "Check CrediScore", desc: "Free & instant" },
                            { step: "2", title: "Apply If Eligible", desc: "Only qualified users" },
                            {
                                step: "3",
                                title: "Upload & Get Money",
                                desc: "Fast approval & transfer",
                            },
                        ].map((item) => (
                            <div key={item.step} className="space-y-4">
                                <div className="text-5xl sm:text-6xl font-bold text-blue-600">
                                    {item.step}
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold">{item.title}</h3>
                                <p className="text-gray-600 text-base sm:text-lg">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-20 sm:py-24 px-6 bg-linear-to-r from-blue-700 to-green-600 text-white text-center">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
                    Need Money Right Now?
                </h2>
                <p className="text-xl sm:text-2xl mb-10 opacity-90">
                    Join 50,000+ users who got instant loans
                </p>
                <button className="bg-white text-blue-700 px-10 sm:px-12 py-5 sm:py-6 rounded-2xl text-xl sm:text-2xl font-bold shadow-2xl hover:scale-105 transition">
                    Apply in 2 Minutes →
                </button>
                <p className="mt-6 text-lg opacity-80">
                    Zero processing fee • No credit score needed
                </p>
            </section>

            {/* FOOTER */}
            <footer className="py-10 bg-gray-900 text-gray-400 text-center text-sm sm:text-base">
                <p>© {new Date().getFullYear()} CrediScore • Income-First Digital Lending</p>
                <p className="mt-2">Privacy Protected • RBI Guidelines Compliant</p>
            </footer>
        </div>
    );
}
