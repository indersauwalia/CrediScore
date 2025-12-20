import { useState, useEffect } from 'react'
import { Route, Routes, useLocation } from "react-router";
import './App.css'
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreditScoreForm from './pages/CreditScoreForm';
import IncomeVerificationForm from './pages/IncomeVerificationForm';
import Loans from './pages/Loans';
import AdminDashboard from './pages/AdminDashboard';

function App() {
    return (
        <>
        <Navbar />
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/credit-form" element={<CreditScoreForm />} />
            <Route path="/verify-income" element={<IncomeVerificationForm />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/admin" element={<AdminDashboard />} />
            
        </Routes>
        </>
    );
}

export default App
