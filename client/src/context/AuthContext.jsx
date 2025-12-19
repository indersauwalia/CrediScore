import React, { createContext, useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Initial load: This uses the loading spinner for the first app boot
    const loadUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const res = await api.get("/auth/me");
            setUser(res.data);
        } catch (err) {
            console.error("Failed to load user:", err.response?.data || err.message);
            localStorage.removeItem("token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    // SILENT REFRESH: Updates user data without triggering the global loading spinner
    const refreshUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await api.get("/auth/me");
            setUser(res.data); // Update status (e.g., Pending -> Approved)
        } catch (err) {
            console.error("Silent refresh failed:", err);
        }
    };

    const signup = async (userData) => {
        try {
            const res = await api.post("/auth/signup", userData);
            localStorage.setItem("token", res.data.token);
            await loadUser();
            navigate("/dashboard");
            return { success: true };
        } catch (err) {
            return { success: false, msg: err.response?.data?.msg || "Signup failed" };
        }
    };

    const login = async (credentials) => {
        try {
            const res = await api.post("/auth/login", credentials);
            localStorage.setItem("token", res.data.token);
            await loadUser();
            navigate("/dashboard");
            return { success: true };
        } catch (err) {
            return { success: false, msg: err.response?.data?.msg || "Invalid credentials" };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loading, signup, login, logout, refreshUser }}>
            {loading ? (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-xl text-gray-700">Loading your profile...</p>
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};