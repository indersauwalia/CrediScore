import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { GiReceiveMoney } from "react-icons/gi";
import { FcGoogle } from "react-icons/fc";
import { MdEmail, MdLockOutline } from "react-icons/md";
import LoanImgLoginpage from "../assets/LoanImgLoginpage.png";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { user, logout } = useContext(AuthContext);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/dashboard", { replace: true });
        }
    }, [user, navigate]);

    const isValid = emailOrPhone.trim() !== "" && password.length >= 6;

    const handleLogin = async () => {
        if (!isValid || loading) return;

        setLoading(true);
        const result = await login({
            emailOrPhone: emailOrPhone.trim(),
            password,
        });

        setLoading(false);

        if (!result.success) {
            alert(result.msg || "Login failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-green-50 flex flex-col">
            <div className="flex-1 flex items-center justify-center px-4 py-8 overflow-y-auto">
                <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
                    <div className="bg-linear-to-br from-blue-600 to-green-600 p-6 md:p-8 text-white flex flex-col justify-center items-center text-center">
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
                                className="w-full mx-auto rounded-2xl shadow-2xl border-4 border-white/30"
                            />
                        </div>
                    </div>

                    <div className="p-6 md:p-10 flex items-center justify-center">
                        <div className="w-full max-w-xs space-y-6">
                            <div className="text-center">
                                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">
                                    Welcome Back
                                </h2>
                                <p className="text-base text-gray-600 mt-2">
                                    Check your CrediScore instantly
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <div className="flex rounded-xl border-2 border-gray-300 focus-within:border-blue-600 transition-all">
                                    <span className="px-4 py-4 bg-gray-50 flex items-center">
                                        <MdEmail className="text-xl text-gray-500" />
                                    </span>
                                    <input
                                        type="text"
                                        value={emailOrPhone}
                                        onChange={(e) => setEmailOrPhone(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full px-4 py-4 outline-none text-lg"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="flex rounded-xl border-2 border-gray-300 focus-within:border-blue-600 transition-all">
                                    <span className="px-4 py-4 bg-gray-50 flex items-center">
                                        <MdLockOutline className="text-xl text-gray-500" />
                                    </span>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full px-4 py-4 outline-none text-lg"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleLogin}
                                disabled={!isValid || loading}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                                    isValid && !loading
                                        ? "bg-linear-to-r from-blue-600 to-green-600 text-white hover:scale-105"
                                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                }`}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>

                            <p className="text-center text-sm text-gray-600">
                                New here?{" "}
                                <NavLink
                                    to="/signup"
                                    className="text-blue-600 font-bold hover:underline"
                                >
                                    Sign Up
                                </NavLink>
                            </p>

                            <p className="text-center text-xs text-gray-500">
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