// components/VoucherInput.tsx
"use client";
import { useState, useEffect } from "react";

export default function VoucherInput() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showFindModal, setShowFindModal] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [finding, setFinding] = useState(false);
  const [foundVoucher, setFoundVoucher] = useState<any>(null);
  const [error, setError] = useState("");

  // Listen for voucher-ready event from payment confirmation
  useEffect(() => {
    const handleVoucherReady = (e: any) => {
      if (e.detail?.username && e.detail?.password) {
        setUsername(e.detail.username);
        setPassword(e.detail.password);
        // Show a brief notification
        console.log("Voucher credentials auto-filled!");
      }
    };

    window.addEventListener("voucher-ready", handleVoucherReady);
    return () => window.removeEventListener("voucher-ready", handleVoucherReady);
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      return alert("Please enter both username and password");
    }
    // Call your validate API
    const res = await fetch("/api/vouchers/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    alert(data.valid ? "Connected!" : "Invalid username or password");
  };

  const handleFindVoucher = async () => {
    if (!transactionId.trim()) {
      setError("Please enter your transaction ID");
      return;
    }

    setFinding(true);
    setError("");
    setFoundVoucher(null);

    try {
      const res = await fetch("/api/vouchers/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: transactionId.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        setFoundVoucher(data);
        // Auto-fill the username and password
        if (data.username) setUsername(data.username);
        setPassword(data.voucher);
        // Close modal after 3 seconds
        setTimeout(() => {
          setShowFindModal(false);
        }, 3000);
      } else {
        setError(data.error || "Transaction not found");
      }
    } catch (err) {
      setError("Failed to retrieve voucher. Please try again.");
    } finally {
      setFinding(false);
    }
  };

  const resetFindModal = () => {
    setShowFindModal(false);
    setTransactionId("");
    setError("");
    setFoundVoucher(null);
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setShowFindModal(false);
    setTransactionId("");
    setError("");
    setFoundVoucher(null);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-4 mb-8">
        <div className="space-y-3">
          <div>
            <label className="label justify-center">
              <span className="label-text">Username</span>
            </label>
            <input
              type="text"
              placeholder="Enter username"
              className="input input-bordered w-full text-center"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
          <div>
            <label className="label justify-center">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter password"
              className="input input-bordered w-full text-center"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
          <div className="mt-4">
            <button 
              type="button"
              onClick={handleLogin} 
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg text-base font-medium hover:bg-green-700 transition-colors cursor-pointer"
              style={{ display: 'block', width: '100%' }}
            >
              Login
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowFindModal(true)}
          className="link link-primary text-sm mt-3 block text-center w-full"
        >
          Already bought? Find My Voucher
        </button>
      </div>

      {/* Find Voucher Modal */}
      {showFindModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Find My Voucher</h2>
              <button
                onClick={resetFindModal}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            {!foundVoucher ? (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Enter the transaction ID you received after payment to retrieve your voucher code.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Transaction ID</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter transaction ID"
                      className="input input-bordered w-full"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleFindVoucher()}
                    />
                  </div>

                  {error && (
                    <div className="alert alert-error">
                      <span className="text-sm">{error}</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={resetFindModal}
                      className="btn btn-outline flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleFindVoucher}
                      disabled={finding}
                      className="btn btn-success text-white flex-1"
                    >
                      {finding ? "Searching..." : "Find Voucher"}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="alert alert-success">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Voucher found!</span>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                  {foundVoucher.username && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Username:</p>
                      <p className="text-xl font-bold text-green-700 font-mono">
                        {foundVoucher.username}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Password / Voucher Code:</p>
                    <p className="text-xl font-bold text-green-700 font-mono">
                      {foundVoucher.voucher}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t border-green-200">
                    <div>
                      <p className="text-gray-500">Provider:</p>
                      <p className="font-semibold">{foundVoucher.provider}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Amount:</p>
                      <p className="font-semibold">UGX {foundVoucher.amount}</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Use these credentials to log in to the WiFi network.
                </p>

                <button
                  onClick={resetFindModal}
                  className="btn btn-success text-white w-full"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
