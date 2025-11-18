// components/PaymentModal.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const closePaymentModal = () => {
  (document.getElementById("payment-modal") as any)?.close();
};

export default function PaymentModal() {
  const [phone, setPhone] = useState("");
  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<"airtel" | "mtn">("mtn");
  const [transactionId, setTransactionId] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);

  // Listen for open event from PackageCard
  useEffect(() => {
    const handleOpenPayment = (e: any) => {
      setPkg(e.detail);
      setShowSuccess(false);
      setTransactionId("");
      setPhone("");
      setCheckingPayment(false);
      (document.getElementById("payment-modal") as any).showModal();
    };

    window.addEventListener("open-payment", handleOpenPayment);
    return () => window.removeEventListener("open-payment", handleOpenPayment);
  }, []);

  // Poll for payment confirmation
  useEffect(() => {
    if (!transactionId || !showSuccess) return;

    setCheckingPayment(true);
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch("/api/vouchers/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transactionId }),
        });

        const data = await res.json();
        
        if (data.success && data.hasVoucher && data.status === "COMPLETED") {
          // Payment confirmed! Auto-fill credentials
          clearInterval(pollInterval);
          setCheckingPayment(false);
          
          // Dispatch event to auto-fill voucher
          window.dispatchEvent(
            new CustomEvent("voucher-ready", {
              detail: {
                username: data.username,
                password: data.voucher,
              },
            })
          );

          // Close modal and show success message
          setTimeout(() => {
            closePaymentModal();
            setShowSuccess(false);
            setTransactionId("");
            alert("Payment confirmed! Your credentials have been filled in automatically.");
          }, 1000);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    }, 2000); // Check every 2 seconds

    // Stop polling after 2 minutes
    const timeout = setTimeout(() => {
      clearInterval(pollInterval);
      setCheckingPayment(false);
    }, 120000); // 2 minutes

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, [transactionId, showSuccess]);

  const initiate = async () => {
    if (!phone || !pkg) return;
    setLoading(true);
    setShowSuccess(false);
    setTransactionId("");

    const endpoint = `/api/${provider}/initiate`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, amount: pkg.price, packageId: pkg.id }),
    });

    const data = await res.json();
    if (data.success) {
      setTransactionId(data.transactionId);
      setShowSuccess(true);
      setCheckingPayment(true);
    } else {
      alert("Payment failed: " + (data.error || "Try again"));
    }
    setLoading(false);
  };

  return (
    <dialog id="payment-modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirm Payment</h3>
        {pkg && (
          <p className="py-2">
            {pkg.title} – <strong>UGX {pkg.price.toLocaleString()}</strong>
          </p>
        )}

        {/* Provider Selector */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setProvider("airtel")}
            className={`flex-1 btn ${provider === "airtel" ? "btn-success" : "btn-outline"}`}
          >
            <Image src="/airtel.png" alt="Airtel" width={20} height={20} className="mr-1" />
            Airtel
          </button>
          <button
            onClick={() => setProvider("mtn")}
            className={`flex-1 btn ${provider === "mtn" ? "btn-success" : "btn-outline"}`}
          >
            <Image src="/mtn.png" alt="MTN" width={20} height={20} className="mr-1" />
            MTN
          </button>
        </div>

        {showSuccess && transactionId ? (
          <div className="space-y-4 mt-4">
            <div className={`alert ${checkingPayment ? "alert-warning" : "alert-info"}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span className="text-sm">
                {checkingPayment 
                  ? "Waiting for payment confirmation... Your credentials will be filled automatically once confirmed."
                  : "Check your phone and approve the payment!"}
              </span>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-2">
                <strong>Save this Transaction ID</strong> to retrieve your voucher later:
              </p>
              <div className="bg-white rounded p-3 border border-blue-300">
                <p className="font-mono text-sm font-bold text-blue-700 break-all">
                  {transactionId}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Your voucher will be sent via SMS/WhatsApp once payment is confirmed. 
                If you lose it, use this Transaction ID in "Find My Voucher".
              </p>
            </div>

            <div className="modal-action mt-4">
              <button
                className="btn btn-success w-full"
                onClick={() => {
                  closePaymentModal();
                  setShowSuccess(false);
                  setTransactionId("");
                }}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Phone Input */}
            <input
              type="tel"
              placeholder="Enter Mobile Money number (e.g. 07xx)"
              className="input input-bordered w-full mt-4"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            {/* Actions */}
            <div className="modal-action">
              <button className="btn" onClick={closePaymentModal}>
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={initiate}
                disabled={loading || !phone}
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
