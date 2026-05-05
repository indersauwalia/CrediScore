import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router";
import { GiReceiveMoney } from "react-icons/gi";
import { MdPerson, MdCake, MdPhone, MdEmail, MdLockOutline, MdArrowBack } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";

export default function Signup() {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const isValid = name.length > 2 && age >= 18 && phone.length === 10 && email.includes("@") && password.length >= 6;

    const handleSignup = async () => {
        if (!isValid) return;
        const result = await signup({ name, age: Number(age), phone, email, password });
        if (!result.success) {
            alert(result.msg || "Signup failed. Please try again.");
        }
    };

    return (
        <div className="flex-grow flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[100px]" />
                <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-100/50 rounded-full blur-[100px]" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            </div>

            <div className="w-full max-w-sm space-y-8 relative z-10">
                <div className="text-center space-y-4">
                    <div className="inline-flex p-3 bg-slate-900 rounded-2xl shadow-xl text-white mb-2">
                        <GiReceiveMoney size={28} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 uppercase tracking-widest">Get Started</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Create your secure financial account</p>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-2xl space-y-5">
                    <div className="space-y-4">
                        {/* Full Name - Single Line */}
                        <div className="space-y-1.5">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Full Legal Name</label>
                            <div className="relative">
                                <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter full name" className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-all" />
                            </div>
                        </div>

                        {/* Phone & Age - Combined Line */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Contact Number</label>
                                <div className="relative">
                                    <MdPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="9876543210" className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-all" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Age</label>
                                <div className="relative">
                                    <MdCake className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input type="number" value={age} onChange={(e) => setAge(e.target.value.replace(/\D/g, "").slice(0, 2))} placeholder="18+" className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-all" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                            <div className="relative">
                                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@domain.com" className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-all" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Password</label>
                            <div className="relative">
                                <MdLockOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-all" />
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleSignup}
                        disabled={!isValid}
                        className={`w-full py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl active:scale-95 ${
                            isValid ? "bg-slate-900 text-white hover:bg-blue-600 shadow-blue-100" : "bg-slate-100 text-slate-300 cursor-not-allowed"
                        }`}
                    >
                        Register Account
                    </button>
                </div>
            </div>
        </div>
    );
}
