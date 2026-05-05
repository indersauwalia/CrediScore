import { useContext } from "react";
import { NavLink, useNavigate, useLocation } from "react-router";
import { GiReceiveMoney } from "react-icons/gi";
import { MdLogout } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    const linkClass = ({ isActive }) =>
        `text-[11px] font-black uppercase tracking-widest transition-all ${
            isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "text-slate-400 hover:text-slate-900 pb-1 border-b-2 border-transparent"
        }`;

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center h-14">
                    <NavLink to={user ? (user.role === 'admin' ? "/admin" : "/dashboard") : "/"} className="flex items-center gap-2">
                        <div className="p-1.5 bg-slate-900 rounded-lg shadow-sm">
                            <GiReceiveMoney className="text-white text-lg" />
                        </div>
                        <h1 className="text-lg font-black text-slate-900 uppercase tracking-tighter">
                            CrediScore
                        </h1>
                    </NavLink>

                    {user ? (
                        <div className="flex items-center gap-8">
                            {user.role === "user" && (
                                <div className="hidden md:flex items-center gap-6">
                                    <NavLink to="/dashboard" className={linkClass}>Home</NavLink>
                                    <NavLink to="/loans" className={linkClass}>Marketplace</NavLink>
                                    <NavLink to="/tools" className={linkClass}>Tools</NavLink>
                                </div>
                            )}
                            
                            <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                        {user.role === "admin" ? "Administrator" : "Active Profile"}
                                    </span>
                                    <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight">
                                        {user.name.split(' ')[0]}
                                    </span>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    title="Secure Logout"
                                    className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all active:scale-95"
                                >
                                    <MdLogout size={18} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            {location.pathname === "/login" ? (
                                <NavLink to="/signup" className="text-[10px] font-black uppercase tracking-widest text-slate-900 hover:text-blue-600 transition-colors">
                                    Create Account
                                </NavLink>
                            ) : (
                                <NavLink to="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-900 hover:text-blue-600 transition-colors">
                                    Sign In
                                </NavLink>
                            )}
                        </div>
                    )}
                </div>
            </nav>
            <div className="h-14" />
        </>
    );
}