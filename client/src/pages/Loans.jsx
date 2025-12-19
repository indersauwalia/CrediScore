import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { GiReceiveMoney } from "react-icons/gi";
import { MdArrowForward, MdVerified, MdWarning, MdBlock, MdHourglassEmpty } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";

export default function LoanPage() {
    const { user, refreshUser } = useContext(AuthContext);
    const [myApplications, setMyApplications] = useState([]); // Track existing loans
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/", { replace: true });
        } else {
            if (user.verificationStatus !== "approved") {
                refreshUser();
            }
            fetchMyApplications(); // Fetch existing requests on load
        }
    }, []);

    // Fetch existing loan requests to check for "Already Applied" status
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

    const loanSchemes = [
        {
            title: "Personal Loan",
            maxAmount: 150000,
            tenure: "6 - 36 months",
            baseRate: 14.0,
            processingFee: "1% + GST",
            description: "For personal needs, medical, travel, or any emergency.",
            recommended: true,
        },
        {
            title: "Salary Advance",
            maxAmount: 100000,
            tenure: "3 - 12 months",
            baseRate: 8.0,
            processingFee: "Nil",
            description: "Quick cash advance against your salary. Instant disbursement.",
            recommended: verificationStatus === "approved",
        },
        {
            title: "Business Boost Loan",
            maxAmount: 125000,
            tenure: "12 - 48 months",
            baseRate: 13.5,
            processingFee: "1.5% + GST",
            description: "Grow your small business or self-employment venture.",
            recommended: crediScore >= 700,
        },
        {
            title: "Education Loan",
            maxAmount: 50000,
            tenure: "12 - 60 months",
            baseRate: 11.5,
            processingFee: "1% + GST",
            description: "Fund higher education with flexible repayment.",
            recommended: crediScore >= 650,
        },
        {
            title: "Two-Wheeler Loan",
            maxAmount: 150000,
            tenure: "12 - 36 months",
            baseRate: 9.5,
            processingFee: "1% + GST",
            description: "Buy your dream bike with low interest and easy EMIs.",
            recommended: crediScore >= 650,
        },
        {
            title: "Medical Emergency Loan",
            maxAmount: 75000,
            tenure: "6 - 24 months",
            baseRate: 10.0,
            processingFee: "0.5% + GST",
            description: "Immediate funds for unplanned medical treatments.",
            recommended: true,
        },
    ];

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
            if (crediScore >= 750) return "10.5%";
            if (crediScore >= 650) return "12%";
            return `${scheme.baseRate}%`;
        }
        return `${scheme.baseRate}%`;
    };

    const handleApply = async (scheme) => {
        if (!isEligible) return;

        const tenureString = scheme.tenure.includes("-")
            ? scheme.tenure.split("-")[1].trim()
            : scheme.tenure;
        const cleanTenure = parseInt(tenureString.replace(/[^0-9]/g, ""));
        const cleanRate = parseFloat(getInterestRate(scheme).replace("%", ""));

        const applicationData = {
            loanType: scheme.title,
            requestedAmount: Number(getMaxAmount(scheme)),
            tenure: cleanTenure,
            interestRate: cleanRate,
            processingFee: scheme.processingFee,
        };

        try {
            const res = await api.post("/loans/apply", applicationData);
            if (res.status === 200 || res.status === 201) {
                alert("Loan application submitted successfully!");
                fetchMyApplications();
                navigate("/dashboard");
            }
        } catch (err) {
            const msg = err.response?.data?.msg || "Application failed.";
            alert(`Error: ${msg}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
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
                    </div>
                </div>
            </nav>

            <div className="pt-24 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
                            Choose Your Loan Scheme
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Instant digital loans based on your income-verified CrediScore.
                        </p>
                    </div>

                    {!isEligible && (
                        <div className="mb-10">
                            {verificationStatus !== "approved" ? (
                                <div className="bg-orange-50 border-2 border-orange-300 rounded-2xl p-8 flex items-center justify-center gap-6 shadow-lg">
                                    <MdWarning className="text-6xl text-orange-600" />
                                    <div className="text-left">
                                        <h3 className="text-2xl font-bold text-orange-800">
                                            Income Verification {user.verificationStatus}
                                        </h3>
                                        <p className="text-lg text-orange-700 mt-2">
                                            Please complete income verification to become eligible
                                            for loans.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-8 flex items-center justify-center gap-6 shadow-lg">
                                    <MdBlock className="text-6xl text-red-600" />
                                    <div className="text-left">
                                        <h3 className="text-2xl font-bold text-red-800">
                                            No Remaining Credit Limit
                                        </h3>
                                        <p className="text-lg text-red-700 mt-2">
                                            Your credit limit is fully utilized.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {loanSchemes.map((scheme, index) => {
                            const maxAmt = getMaxAmount(scheme);
                            const rate = getInterestRate(scheme);
                            const isRecommended = scheme.recommended && isEligible;

                            // Check if this specific scheme has already been applied for
                            const existingRequest = myApplications.find(
                                (app) =>
                                    app.loanType === scheme.title && app.requestStatus === "pending"
                            );

                            return (
                                <div
                                    key={index}
                                    className={`bg-white rounded-3xl shadow-xl border-2 ${
                                        isRecommended
                                            ? "border-green-500 ring-4 ring-green-100"
                                            : "border-gray-200"
                                    } p-8 relative overflow-hidden transition hover:scale-105`}
                                >
                                    {isRecommended && (
                                        <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 rounded-bl-2xl text-sm font-bold">
                                            Recommended
                                        </div>
                                    )}
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                        {scheme.title}
                                    </h3>
                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <p className="text-gray-600">Max Amount</p>
                                            <p className="text-3xl font-extrabold text-blue-600">
                                                {formatCurrency(maxAmt)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Tenure</p>
                                            <p className="text-xl font-semibold">{scheme.tenure}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Interest Rate</p>
                                            <p className="text-xl font-semibold">{rate} p.a.</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Processing Fee</p>
                                            <p className="text-xl font-semibold">
                                                {scheme.processingFee}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-8">{scheme.description}</p>

                                    {existingRequest ? (
                                        <div className="w-full py-4 rounded-xl text-xl font-bold bg-amber-100 text-amber-700 flex items-center justify-center gap-3 border-2 border-amber-200">
                                            <MdHourglassEmpty className="animate-spin" />
                                            Under Review
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleApply(scheme)}
                                            disabled={!isEligible}
                                            className={`w-full py-4 rounded-xl text-xl font-bold transition flex items-center justify-center gap-3 ${
                                                isEligible
                                                    ? "bg-gradient-to-r from-blue-600 to-green-600 text-white hover:scale-105 shadow-lg"
                                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            }`}
                                        >
                                            {isEligible ? (
                                                <>
                                                    Apply Now
                                                    <MdArrowForward className="text-2xl" />
                                                </>
                                            ) : verificationStatus === "approved" ? (
                                                "Limit Utilized"
                                            ) : (
                                                "Verify Income First"
                                            )}
                                        </button>
                                    )}

                                    {isEligible && isRecommended && !existingRequest && (
                                        <p className="text-center mt-4 text-green-600 font-medium flex items-center justify-center gap-2">
                                            <MdVerified /> Best match for your profile
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {isEligible && (
                        <div className="text-center">
                            <p className="text-2xl text-gray-700 mb-6">
                                Remaining Limit:{" "}
                                <span className="font-bold text-green-600">
                                    {formatCurrency(remainingLimit)}
                                </span>
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <footer className="py-10 text-center text-gray-500 text-sm border-t border-gray-200">
                © {new Date().getFullYear()} CrediScore • RBI Guidelines Compliant
            </footer>
        </div>
    );
}