// components/EMICalculator.jsx
import { useState } from "react";
import { MdCalculate } from "react-icons/md";

const EMICalculator = ({ loanDetails, onCalculate }) => {
    const [principal, setPrincipal] = useState(loanDetails?.maxAmount || 50000);
    const [tenure, setTenure] = useState(12);
    const [interestRate, setInterestRate] = useState(loanDetails?.interestRate || 12);
    const [emi, setEmi] = useState(0);
    const [totalPayable, setTotalPayable] = useState(0);
    const [error, setError] = useState("");

    const calculateEMI = () => {
        setError("");
        if (principal <= 0 || tenure <= 0 || interestRate <= 0) {
            setError("Please enter valid values for all fields.");
            return;
        }

        const monthlyRate = interestRate / 100 / 12;
        const numPayments = tenure;
        const emiAmount =
            (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
            (Math.pow(1 + monthlyRate, numPayments) - 1);
        const totalAmount = emiAmount * numPayments;

        setEmi(emiAmount.toFixed(2));
        setTotalPayable(totalAmount.toFixed(2));
        if (onCalculate) onCalculate({ emi: emiAmount, total: totalAmount });
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <MdCalculate className="text-blue-600" />
                EMI Calculator
            </h2>
            <p className="text-gray-600 mb-6">
                Calculate your monthly installments for loans.
            </p>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loan Amount (₹)
                    </label>
                    <input
                        type="number"
                        value={principal}
                        onChange={(e) => setPrincipal(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 50000"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tenure (months)
                    </label>
                    <input
                        type="number"
                        value={tenure}
                        onChange={(e) => setTenure(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 12"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Interest Rate (% p.a.)
                    </label>
                    <input
                        type="number"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 12"
                    />
                </div>
            </div>

            <button
                onClick={calculateEMI}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 rounded-xl text-xl font-bold hover:scale-105 transition shadow-lg mb-8"
            >
                Calculate EMI
            </button>

            {emi > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">EMI Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div>
                            <p className="text-3xl font-bold text-green-600">₹{emi}</p>
                            <p className="text-gray-600">Monthly EMI</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-blue-600">₹{totalPayable}</p>
                            <p className="text-gray-600">Total Payable</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-orange-600">
                                ₹{(totalPayable - principal).toLocaleString()}
                            </p>
                            <p className="text-gray-600">Total Interest</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EMICalculator;