// pages/AdminDashboard.jsx
import { useContext, useEffect, useState } from "react";
import { GiReceiveMoney } from "react-icons/gi";
import { MdPendingActions, MdVerified, MdClose } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";

export default function AdminDashboard() {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("income");
    const [incomeRequests, setIncomeRequests] = useState([]);
    const [loanRequests, setLoanRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch pending requests
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [incomeRes, loanRes] = await Promise.all([
                    fetch("/api/admin/pending-income"),
                    fetch("/api/admin/pending-loans"),
                ]);

                if (!incomeRes.ok || !loanRes.ok) {
                    throw new Error("Failed to fetch data");
                }

                const incomeData = await incomeRes.json();
                const loanData = await loanRes.json();

                setIncomeRequests(incomeData.requests || []);
                setLoanRequests(loanData.requests || []);
            } catch (err) {
                console.error("Error fetching admin data:", err);
                alert("Failed to load data. Please refresh the page.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Approve/Reject Income Verification
    const handleIncomeAction = async (requestId, action, note = "") => {
        try {
            const res = await fetch(`/api/admin/income-${action}/${requestId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ adminNote: note }),
            });

            if (res.ok) {
                setIncomeRequests((prev) => prev.filter((r) => r._id !== requestId));
                alert(
                    `Income verification ${
                        action === "approve" ? "approved" : "rejected"
                    } successfully`
                );
            } else {
                const errorData = await res.json();
                alert(errorData.msg || "Action failed");
            }
        } catch (err) {
            console.error("Network error:", err);
            alert("Network error. Please try again.");
        }
    };

    // Approve/Reject Loan Request
    const handleLoanAction = async (requestId, action, note = "") => {
        try {
            const res = await fetch(`/api/admin/loan-${action}/${requestId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ adminNote: note }),
            });

            if (res.ok) {
                setLoanRequests((prev) => prev.filter((r) => r._id !== requestId));
                alert(
                    `Loan request ${action === "approve" ? "approved" : "rejected"} successfully`
                );
            } else {
                const errorData = await res.json();
                alert(errorData.msg || "Action failed");
            }
        } catch (err) {
            console.error("Network error:", err);
            alert("Network error. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
                <p className="text-2xl text-gray-600">Loading Admin Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
            {/* Same Navbar as other pages */}
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
                            Admin View • Welcome, {user?.name || "Admin"}
                        </span>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="pt-24 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Page Title */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-extrabold text-gray-800 mb-4 flex items-center justify-center gap-4">
                            <MdPendingActions className="text-6xl text-blue-600" />
                            Admin Dashboard
                        </h1>
                    </div>

                    {/* Tabs */}
                    <div className="flex justify-center gap-6 mb-10">
                        <button
                            onClick={() => setActiveTab("income")}
                            className={`px-8 py-4 rounded-xl text-lg font-semibold transition shadow-md ${
                                activeTab === "income"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            Pending Income Verification ({incomeRequests.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("loans")}
                            className={`px-8 py-4 rounded-xl text-lg font-semibold transition shadow-md ${
                                activeTab === "loans"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            Pending Loan Requests ({loanRequests.length})
                        </button>
                    </div>

                    {/* Income Verification Table */}
                    {activeTab === "income" && (
                        <div className="bg-white rounded-3xl shadow-xl p-8">
                            <table className="min-w-full">
                                <thead className="border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                            User
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                            CrediScore
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                            Monthly Income
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                            Proof Document
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                            Submitted On
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {incomeRequests.map((req) => (
                                        <tr key={req._id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {req.user?.name || "Unknown User"}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {req.income?.pan || "N/A"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {req.user?.crediScore ?? 0}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                ₹
                                                {req.income?.monthlyIncome?.toLocaleString() ||
                                                    "N/A"}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {req.income?.proofFilename ? (
                                                    <a
                                                        href={`/api/admin/view-proof/${req.income._id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline font-medium"
                                                    >
                                                        {req.income.proofFilename}
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-500">No file</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <button
                                                    onClick={() =>
                                                        handleIncomeAction(req._id, "approve")
                                                    }
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mr-2 transition"
                                                >
                                                    <MdVerified className="inline mr-1" /> Approve
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const note = prompt(
                                                            "Reason for rejection (optional):"
                                                        );
                                                        handleIncomeAction(
                                                            req._id,
                                                            "reject",
                                                            note || ""
                                                        );
                                                    }}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                                                >
                                                    <MdClose className="inline mr-1" /> Reject
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {incomeRequests.length === 0 && (
                                <div className="text-center py-16 text-gray-500 text-lg">
                                    No pending income verification requests
                                </div>
                            )}
                        </div>
                    )}

                    {/* Loan Requests Table */}
                    {activeTab === "loans" && (
                        <div className="bg-white rounded-3xl shadow-xl p-8">
                            <table className="min-w-full">
                                <thead className="border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                            User
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                            Loan Type
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                            Requested Amount
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                            Tenure
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                            Interest Rate
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                            Submitted On
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loanRequests.map((req) => (
                                        <tr key={req._id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {req.user?.name || "Unknown User"}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {req.user?.phone || "N/A"}
                                                    {/* {console.log(req.income?.pan)} */}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {req.loanType}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                ₹{req.requestedAmount?.toLocaleString() || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {req.tenure} months
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {req.interestRate}%
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <button
                                                    onClick={() =>
                                                        handleLoanAction(req._id, "approve")
                                                    }
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mr-2 transition"
                                                >
                                                    <MdVerified className="inline mr-1" /> Approve
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const note = prompt(
                                                            "Reason for rejection (optional):"
                                                        );
                                                        handleLoanAction(
                                                            req._id,
                                                            "reject",
                                                            note || ""
                                                        );
                                                    }}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                                                >
                                                    <MdClose className="inline mr-1" /> Reject
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {loanRequests.length === 0 && (
                                <div className="text-center py-16 text-gray-500 text-lg">
                                    No pending loan requests
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className="py-10 text-center text-gray-500 text-sm border-t border-gray-200">
                © {new Date().getFullYear()} CrediScore • Income-First Digital Lending • RBI
                Guidelines Compliant
            </footer>
        </div>
    );
}
