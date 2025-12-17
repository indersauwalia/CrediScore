// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadUser = async () => {
        const token = localStorage.getItem("token");
        console.log("🔑 Token exists:", !!token);

        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const res = await api.get("/auth/me");
            console.log("User loaded:", res.data);
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
        <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
            {loading ? (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
                    <p className="text-xl">Loading...</p>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};