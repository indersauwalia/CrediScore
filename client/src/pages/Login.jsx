import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { GiReceiveMoney } from "react-icons/gi";
import { MdEmail, MdLockOutline, MdArrowBack } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { user, login } = useContext(AuthContext);
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
        <div className="flex-grow flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[100px]" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-emerald-100/50 rounded-full blur-[100px]" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            </div>

            <div className="w-full max-w-sm space-y-8 relative z-10">
                <div className="text-center space-y-4">
                    <div className="inline-flex p-3 bg-slate-900 rounded-2xl shadow-xl text-white mb-2">
                        <GiReceiveMoney size={28} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 uppercase tracking-widest">Sign In</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Access your financial dashboard</p>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-2xl space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Identifier (Email/Phone)</label>
                            <div className="relative">
                                <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="text" 
                                    value={emailOrPhone} 
                                    onChange={(e) => setEmailOrPhone(e.target.value)}
                                    placeholder="Enter identifier"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-50 rounded-xl text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Security Key</label>
                            <div className="relative">
                                <MdLockOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-50 rounded-xl text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleLogin}
                        disabled={!isValid || loading}
                        className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all shadow-xl active:scale-95 ${
                            isValid && !loading ? "bg-slate-900 text-white hover:bg-blue-600 shadow-blue-100" : "bg-slate-100 text-slate-300 cursor-not-allowed"
                        }`}
                    >
                        {loading ? "Signing in..." : "Continue"}
                    </button>

                </div>
            </div>
        </div>
    );
}