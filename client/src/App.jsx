import { useState, useEffect } from 'react'
import { Route, Routes, useLocation } from "react-router";
import './App.css'
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreditScoreForm from './pages/CreditScoreForm';
import IncomeVerificationForm from './pages/IncomeVerificationForm';

function App() {
  return (
      <>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/credit-form" element={<CreditScoreForm />} />
              <Route path="/verify-income" element={<IncomeVerificationForm />} />
          </Routes>
      </>
  );
}

export default App
