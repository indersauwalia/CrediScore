// src/pages/IncomeVerificationForm.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import {
    MdCheckCircle,
    MdError,
    MdArrowBack,
    MdCreditCard,
    MdAccountBalance,
    MdUpload,
} from "react-icons/md";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";

export default function IncomeVerificationForm() {
    const { user, refreshUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [step, setStep] = useState(1);

    // Step 1
    const [panNumber, setPanNumber] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [ifscCode, setIfscCode] = useState("");

    // Step 2
    const [proofFile, setProofFile] = useState(null);

    // UI states
    const [loadingStep1, setLoadingStep1] = useState(false);
    const [step1Message, setStep1Message] = useState("");
    const [step1Success, setStep1Success] = useState(false);

    const [loadingStep2, setLoadingStep2] = useState(false);
    const [step2Message, setStep2Message] = useState("");

    // Validation
    const isPanValid = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber.toUpperCase());
    const isIfscValid = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.toUpperCase());
    const canVerifyStep1 = isPanValid && accountNumber && isIfscValid;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProofFile(file);
        }
    };

    // Step 1: Verify PAN + Account No + IFSC
    const handleVerifyStep1 = async () => {
        if (!canVerifyStep1) return;

        setLoadingStep1(true);
        setStep1Message("");

        try {
            const res = await api.post("/verification/verify-details", {
                pan: panNumber.toUpperCase(),
                accountNumber,
                ifsc: ifscCode.toUpperCase(),
            });

            setStep1Message(res.data.msg || "Details verified successfully!");
            setStep1Success(true);
        } catch (err) {
            setStep1Message(
                err.response?.data?.msg || "Verification failed. Please check your details."
            );
            setStep1Success(false);
        } finally {
            setLoadingStep1(false);
        }
    };

    // Step 2: Final submit with proof upload
    const handleSubmitStep2 = async () => {
        if (!proofFile || !step1Success) {
            alert("Please complete Step 1 and upload a file");
            return;
        }

        setLoadingStep2(true);
        setStep2Message("");

        const formData = new FormData();
        formData.append("proof", proofFile);
        formData.append("pan", panNumber.toUpperCase());
        formData.append("accountNumber", accountNumber);
        formData.append("ifsc", ifscCode.toUpperCase());

        try {
            const res = await api.post("/verification/upload-proof", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setStep2Message("Income verification completed successfully!");
            if (refreshUser) await refreshUser();

            // Redirect to dashboard after success
            navigate("/dashboard");
        } catch (err) {
            setStep2Message(err.response?.data?.msg || "Upload failed. Please try again.");
        } finally {
            setLoadingStep2(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12 px-6">
            <button
                onClick={() => navigate("/dashboard")}
                className="fixed top-24 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
                <MdArrowBack className="text-2xl" /> Back
            </button>

            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
                        Income Verification Layer
                    </h1>
                    <p className="text-xl text-gray-600 mt-4">Complete in 2 steps</p>
                </div>

                {/* Progress Bar */}
                <div className="flex justify-center mb-12">
                    <div className="flex items-center gap-8">
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                                step >= 1 ? "bg-green-600" : "bg-gray-300"
                            }`}
                        >
                            1
                        </div>
                        <div className={`w-32 h-2 ${step >= 2 ? "bg-green-600" : "bg-gray-300"}`} />
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                                step >= 2 ? "bg-green-600" : "bg-gray-300"
                            }`}
                        >
                            2
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-10">
                    {/* Step 1 */}
                    {step === 1 && (
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
                                Step 1: Enter & Verify Details
                            </h2>

                            <div className="space-y-10">
                                {/* PAN */}
                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
                                        <MdCreditCard className="text-2xl text-blue-600" /> PAN
                                        Number
                                    </label>
                                    <input
                                        type="text"
                                        value={panNumber}
                                        onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                                        placeholder="ABCDE1234F"
                                        maxLength="10"
                                        className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 focus:border-blue-600 text-lg font-mono tracking-wider"
                                    />
                                    {panNumber && !isPanValid && (
                                        <p className="text-red-500 text-sm mt-2">
                                            Invalid PAN format
                                        </p>
                                    )}
                                </div>

                                {/* Account No & IFSC in one row */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
                                            <MdAccountBalance className="text-2xl text-green-600" />{" "}
                                            Account Number
                                        </label>
                                        <input
                                            type="text"
                                            value={accountNumber}
                                            onChange={(e) => setAccountNumber(e.target.value)}
                                            placeholder="123456789012"
                                            className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 focus:border-blue-600 text-lg"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-lg font-medium text-gray-700 mb-3">
                                            IFSC Code
                                        </label>
                                        <input
                                            type="text"
                                            value={ifscCode}
                                            onChange={(e) =>
                                                setIfscCode(e.target.value.toUpperCase())
                                            }
                                            placeholder="SBIN0001234"
                                            maxLength="11"
                                            className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 focus:border-blue-600 text-lg font-mono tracking-wider"
                                        />
                                        {ifscCode && !isIfscValid && (
                                            <p className="text-red-500 text-sm mt-2">
                                                Invalid IFSC format
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleVerifyStep1}
                                disabled={loadingStep1 || !canVerifyStep1}
                                className="w-full mt-10 bg-gradient-to-r from-blue-600 to-green-600 text-white py-5 rounded-2xl text-xl font-bold disabled:opacity-50 hover:scale-105 transition"
                            >
                                {loadingStep1 ? "Verifying..." : "Verify Details"}
                            </button>

                            {step1Message && (
                                <div
                                    className={`mt-8 text-center text-lg font-bold py-4 rounded-xl ${
                                        step1Success
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    } flex items-center justify-center gap-3`}
                                >
                                    {step1Success ? (
                                        <MdCheckCircle className="text-3xl" />
                                    ) : (
                                        <MdError className="text-3xl" />
                                    )}
                                    {step1Message}
                                </div>
                            )}

                            {step1Success && (
                                <button
                                    onClick={() => setStep(2)}
                                    className="w-full mt-8 bg-green-600 text-white py-5 rounded-2xl text-xl font-bold hover:scale-105 transition"
                                >
                                    Next → Upload Proof
                                </button>
                            )}
                        </div>
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-800 mb-10">
                                Step 2: Upload Bank Statement or Salary Slip
                            </h2>

                            <div className="border-4 border-dashed border-gray-300 rounded-3xl p-16 hover:border-blue-500 transition">
                                <MdUpload className="text-8xl text-gray-400 mx-auto mb-6" />
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        accept="application/pdf,image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <span className="bg-blue-600 text-white px-12 py-6 rounded-2xl text-xl font-bold hover:bg-blue-700 transition">
                                        Choose File (PDF or Image)
                                    </span>
                                </label>

                                {proofFile && (
                                    <div className="mt-8 flex items-center justify-center gap-4 text-green-600">
                                        <MdCheckCircle className="text-4xl" />
                                        <span className="text-xl font-medium">
                                            {proofFile.name}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-6 mt-12">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 bg-gray-200 py-5 rounded-xl text-xl font-bold hover:bg-gray-300 transition"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmitStep2}
                                    disabled={loadingStep2 || !proofFile}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-5 rounded-xl text-xl font-bold disabled:opacity-50 transition"
                                >
                                    {loadingStep2 ? "Submitting..." : "Complete Verification"}
                                </button>
                            </div>

                            {step2Message && (
                                <div className="mt-10 text-center text-2xl font-bold text-green-600 animate-pulse">
                                    {step2Message}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}