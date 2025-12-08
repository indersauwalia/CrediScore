// pages/Login.jsx
import React, { useState } from "react";
import { GiReceiveMoney } from "react-icons/gi";
import { FcGoogle } from "react-icons/fc";
import { MdEmail, MdPhone, MdLockOutline } from "react-icons/md";
import LoanImgLoginpage from "../assets/LoanImgLoginpage.png";

export default function Login() {
    const [method, setMethod] = useState("phone");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const isValid =
        method === "phone" ? phone.length === 10 : email.includes("@") && password.length >= 6;

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-green-50 flex flex-col">
            {/* Main Card - Scrollable on mobile, fixed on large screens */}
            <div className="flex-1 flex items-center justify-center px-4 py-8 overflow-y-auto">
                <div
                    className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden 
                        grid md:grid-cols-2 
                        sm:max-h-screen"
                >
                    {/* LEFT: Branding */}
                    <div
                        className="bg-linear-to-br from-blue-600 to-green-600 p-6 md:p-8 text-white 
                          flex flex-col justify-center items-center text-center"
                    >
                        <div className="max-w-xs space-y-6">
                            <div className="flex items-center justify-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl">
                                    <GiReceiveMoney className="text-3xl" />
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold">CrediScore</h1>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
                                Real Credit Score
                                <br />
                                Based on Real Income
                            </h2>

                            <div className="space-y-3 text-sm md:text-base">
                                {["100% online", "Instant approval"].map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center justify-center gap-3"
                                    >
                                        <div className="w-5 h-5 bg-white/30 rounded-full flex items-center justify-center text-xs">
                                            ✓
                                        </div>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>

                            <img
                                src={LoanImgLoginpage}
                                alt="CrediScore"
                                className="w-full max-w-[220px] mx-auto rounded-2xl shadow-2xl border-4 border-white/30"
                            />
                        </div>
                    </div>

                    {/* RIGHT: Form - Now fully visible on mobile */}
                    <div className="p-6 md:p-10 flex items-center justify-center">
                        <div className="w-full max-w-xs space-y-5">
                            <div className="text-center">
                                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">
                                    Welcome Back
                                </h2>
                                <p className="text-sm md:text-base text-gray-600 mt-1">
                                    Check your CrediScore instantly
                                </p>
                            </div>

                            {method === "phone" ? (
                                <div className="flex rounded-xl border-2 border-gray-300 focus-within:border-blue-600">
                                    <span className="px-4 py-4 bg-gray-50 flex items-center gap-2">
                                        <MdPhone />
                                    </span>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                                        }
                                        placeholder="98765 43210"
                                        className="w-full px-4 py-4 outline-none"
                                        maxLength={10}
                                    />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex rounded-xl border-2 border-gray-300 focus-within:border-blue-600">
                                        <span className="px-4 py-4 bg-gray-50 flex items-center">
                                            <MdEmail />
                                        </span>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full px-4 py-4 outline-none"
                                        />
                                    </div>
                                    <div className="flex rounded-xl border-2 border-gray-300 focus-within:border-blue-600">
                                        <span className="px-4 py-4 bg-gray-50 flex items-center">
                                            <MdLockOutline />
                                        </span>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter password"
                                            className="w-full px-4 py-4 outline-none"
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                disabled={!isValid}
                                className={`w-full py-4 rounded-xl font-bold transition-all text-lg ${
                                    isValid
                                        ? "bg-linear-to-r from-blue-600 to-green-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                }`}
                            >
                                {method === "phone" ? "Continue with Phone" : "Login with Email"}
                            </button>

                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        setMethod("phone");
                                        setEmail("");
                                        setPassword("");
                                    }}
                                    className={`w-full py-3 rounded-xl border text-sm flex items-center justify-center gap-2 transition ${
                                        method === "phone"
                                            ? "border-blue-600 bg-blue-50"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <MdPhone /> Use Phone Number
                                </button>

                                <button
                                    onClick={() => {
                                        setMethod("email");
                                        setPhone("");
                                    }}
                                    className={`w-full py-3 rounded-xl border text-sm flex items-center justify-center gap-2 transition ${
                                        method === "email"
                                            ? "border-blue-600 bg-blue-50"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <MdEmail /> Use Email & Password
                                </button>

                                <button className="w-full py-3 rounded-xl border border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-2 text-sm">
                                    <FcGoogle className="text-xl" /> Continue with Google
                                </button>
                            </div>

                            <p className="text-center text-xs text-gray-500">
                                New here?{" "}
                                <span className="text-blue-600 font-bold cursor-pointer hover:underline">
                                    Create Account
                                </span>
                            </p>

                            <p className="text-center text-xs text-gray-400">
                                By continuing, you agree to our{" "}
                                <a href="#" className="text-blue-600 underline">
                                    Terms
                                </a>{" "}
                                &{" "}
                                <a href="#" className="text-blue-600 underline">
                                    Privacy Policy
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
