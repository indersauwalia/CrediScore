import { useContext } from "react";
import { NavLink } from "react-router";
import { GiReceiveMoney } from "react-icons/gi";
import { AuthContext } from "../context/AuthContext";

export default function Footer() {
    const { user } = useContext(AuthContext);

    return (
        <footer className="bg-white border-t border-slate-100 py-3 px-6">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Brand & Copyright */}
                <div className="flex items-center gap-4">
                    <NavLink to={user ? (user.role === 'admin' ? "/admin" : "/dashboard") : "/"} className="flex items-center gap-1.5 hover:opacity-70 transition-opacity">
                        <div className="p-1 bg-slate-900 rounded-md">
                            <GiReceiveMoney className="text-white text-sm" />
                        </div>
                        <h1 className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">
                            CrediScore
                        </h1>
                    </NavLink>
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest border-l border-slate-100 pl-4">
                        © {new Date().getFullYear()} CrediScore Inc.
                    </p>
                </div>

                {/* Ultra-Slim Links */}
                <div className="flex items-center gap-6 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
                    <div className="flex items-center gap-1.5 ml-2">
                        <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                        <span className="text-slate-300">Live</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
