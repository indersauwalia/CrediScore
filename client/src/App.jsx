import { useState, useEffect } from 'react'
import { Route, Routes, useLocation } from "react-router";
import './App.css'
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreditScoreForm from './pages/CreditScoreForm';

function App() {
  return (
    <>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/credit-form" element={<CreditScoreForm />} />
        </Routes>
    </>
  )
}

export default App
