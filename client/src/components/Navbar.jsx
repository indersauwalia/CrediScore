// src/components/Navbar.jsx
import { useContext } from "react";
import { useNavigate } from "react-router";
import { GiReceiveMoney } from "react-icons/gi";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    if (!user) return null;

    return (
        <>
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
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full text-sm font-medium transition shadow-md"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
            <div className="h-20"></div> {/* Adjust this height to match navbar */}
        </>
    );
}
