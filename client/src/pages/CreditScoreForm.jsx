// pages/CreditScoreForm.jsx
import React, { useState, useContext } from "react";
import { NavLink } from "react-router";
import { MdWork, MdPerson, MdCreditCard, MdAttachMoney, MdArrowBack } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";

export default function CreditScoreForm() {
    const { logout } = useContext(AuthContext);

    const [monthlyIncome, setMonthlyIncome] = useState("");
    const [monthlyExpense, setMonthlyExpense] = useState("");
    const [employmentType, setEmploymentType] = useState("salaried");
    const [designation, setDesignation] = useState("");
    const [totalExpYears, setTotalExpYears] = useState("");
    const [currentExpYears, setCurrentExpYears] = useState("");
    const [educationLevel, setEducationLevel] = useState("");
    const [gender, setGender] = useState("");
    const [maritalStatus, setMaritalStatus] = useState("");
    const [dependents, setDependents] = useState("");
    const [residenceType, setResidenceType] = useState("");
    const [existingEmi, setExistingEmi] = useState("");
    const [creditCardSpend, setCreditCardSpend] = useState("");
    const [aadhaar, setAadhaar] = useState("");
    const [pan, setPan] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const isValid =
        monthlyIncome > 0 &&
        monthlyExpense >= 0 &&
        totalExpYears >= 0 &&
        currentExpYears >= 0 &&
        educationLevel &&
        gender &&
        maritalStatus &&
        dependents &&
        residenceType &&
        existingEmi >= 0 &&
        aadhaar.length === 12 &&
        pan.length === 10;

    const handleSubmit = async () => {
        if (!isValid || loading) return;

        setLoading(true);
        setMessage("");

        const data = {
            monthlyIncome: Number(monthlyIncome),
            monthlyExpense: Number(monthlyExpense),
            employmentType,
            designation,
            totalExpYears: Number(totalExpYears),
            currentExpYears: Number(currentExpYears),
            educationLevel,
            gender,
            maritalStatus,
            dependents: Number(dependents),
            residenceType,
            existingEmi: Number(existingEmi),
            creditCardSpend: Number(creditCardSpend || 0),
            aadhaar,
            pan,
        };

        try {
            const res = await api.post("/credit/submit-profile", data);
            setMessage(`Success! Profile updated. New CrediScore: ${res.data.crediScore}`);
        } catch (err) {
            setMessage(`${err.response?.data?.msg || "Submission failed."}`);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <NavLink
                        to="/dashboard"
                        className="flex items-center gap-2 text-blue-600 hover:underline font-medium text-lg"
                    >
                        <MdArrowBack className="text-2xl" />
                        Back to Dashboard
                    </NavLink>
                    <button
                        onClick={logout}
                        className="text-red-600 hover:underline font-medium text-lg"
                    >
                        Logout
                    </button>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
                            Complete Your Credit Profile
                        </h1>
                        <p className="text-lg text-gray-600 mt-3">
                            Accurate financial details = Stronger CrediScore for instant lending
                        </p>
                    </div>

                    <div className="space-y-10">
                        {/* Employment Details */}
                        <div className="border-b pb-10">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <MdWork className="text-3xl" /> Employment Details
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Monthly Income (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={monthlyIncome}
                                        onChange={(e) => setMonthlyIncome(e.target.value)}
                                        placeholder="e.g., 50000"
                                        className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 focus:border-blue-600 outline-none text-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Monthly Expense (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={monthlyExpense}
                                        onChange={(e) => setMonthlyExpense(e.target.value)}
                                        placeholder="e.g., 30000 (rent, food, etc.)"
                                        className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 focus:border-blue-600 outline-none text-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Employment Type
                                    </label>
                                    <select
                                        value={employmentType}
                                        onChange={(e) => setEmploymentType(e.target.value)}
                                        className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 focus:border-blue-600 outline-none text-lg"
                                    >
                                        <option value="">Select Type</option>
                                        <option value="salaried">Salaried</option>
                                        <option value="self-employed">Self-Employed</option>
                                        <option value="business">Business Owner</option>
                                        <option value="freelancer">Freelancer</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Designation/Role
                                    </label>
                                    <input
                                        type="text"
                                        value={designation}
                                        onChange={(e) => setDesignation(e.target.value)}
                                        placeholder="e.g., Software Engineer"
                                        className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 focus:border-blue-600 outline-none text-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Total Work Experience (Years)
                                    </label>
                                    <input
                                        type="number"
                                        value={totalExpYears}
                                        onChange={(e) => setTotalExpYears(e.target.value)}
                                        placeholder="e.g., 5"
                                        className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 focus:border-blue-600 outline-none text-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Job Experience (Years)
                                    </label>
                                    <input
                                        type="number"
                                        value={currentExpYears}
                                        onChange={(e) => setCurrentExpYears(e.target.value)}
                                        placeholder="e.g., 2"
                                        className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 focus:border-blue-600 outline-none text-lg"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Personal Details */}
                        <div className="border-b pb-10">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <MdPerson className="text-3xl" /> Personal Details
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Gender
                                    </label>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 focus:border-blue-600 outline-none text-lg"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Marital Status
                                    </label>
                                    <select
                                        value={maritalStatus}
                                        onChange={(e) => setMaritalStatus(e.target.value)}
                                        className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 focus:border-blue-600 outline-none text-lg"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="single">Single</option>
                                        <option value="married">Married</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Number of Dependents
                                    </label>
                                    <input
                                        type="number"
                                        value={dependents}
                                        onChange={(e) => setDependents(e.target.value)}
                                        placeholder="e.g., 2"
                                        className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 focus:border-blue-600 outline-none text-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Residence Type
                                    </label>
                                    <select
                                        value={residenceType}
                                        onChange={(e) => setResidenceType(e.target.value)}
                                        className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 focus:border-blue-600 outline-none text-lg"
                                    >
                                        <option value="">Select Type</option>
                                        <option value="owned">Owned</option>
                                        <option value="rented">Rented</option>
                                        <option value="family">Living with Family</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Highest Education
                                    </label>
                                    <select
                                        value={educationLevel}
                                        onChange={(e) => setEducationLevel(e.target.value)}
                                        className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 focus:border-blue-600 outline-none text-lg"
                                    >
                                        <option value="">Select Education</option>
                                        <option value="below10">Below 10th</option>
                                        <option value="10th">10th Pass</option>
                                        <option value="12th">12th Pass</option>
                                        <option value="graduate">Graduate</option>
                                        <option value="postgraduate">Post Graduate</option>
                                        <option value="professional">Professional Degree</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Financial & KYC */}
                        <div className="pb-10">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <MdCreditCard className="text-3xl" /> Financial & KYC Details
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Existing Monthly EMI (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={existingEmi}
                                        onChange={(e) => setExistingEmi(e.target.value)}
                                        placeholder="e.g., 10000 (0 if none)"
                                        className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 focus:border-blue-600 outline-none text-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Avg Monthly Credit Card Spend (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={creditCardSpend}
                                        onChange={(e) => setCreditCardSpend(e.target.value)}
                                        placeholder="e.g., 5000 (0 if none)"
                                        className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 focus:border-blue-600 outline-none text-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Aadhaar Number
                                    </label>
                                    <input
                                        type="text"
                                        value={aadhaar}
                                        onChange={(e) =>
                                            setAadhaar(
                                                e.target.value.replace(/\D/g, "").slice(0, 12)
                                            )
                                        }
                                        placeholder="12 digits"
                                        maxLength={12}
                                        className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 focus:border-blue-600 outline-none text-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        PAN Number
                                    </label>
                                    <input
                                        type="text"
                                        value={pan}
                                        onChange={(e) =>
                                            setPan(e.target.value.toUpperCase().slice(0, 10))
                                        }
                                        placeholder="e.g., ABCDE1234F"
                                        className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 focus:border-blue-600 outline-none text-lg"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={!isValid || loading}
                            className={`w-full py-5 rounded-xl font-bold text-xl transition-all shadow-lg ${
                                isValid && !loading
                                    ? "bg-gradient-to-r from-blue-600 to-green-600 text-white hover:scale-105"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                            {loading
                                ? "Updating CrediScore..."
                                : "Submit Profile & Update CrediScore"}
                        </button>

                        {message && (
                            <div
                                className={`text-center text-lg font-bold py-4 rounded-xl mt-6 ${
                                    message.includes("Success")
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                {message}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
