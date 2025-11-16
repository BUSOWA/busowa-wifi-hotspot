// components/PaymentModal.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { closePaymentModal } from "@/lib/modal";

export default function PaymentModal() {
  const [phone, setPhone] = useState("");
  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<"airtel" | "mtn">("mtn");

  // Listen for open event from PackageCard
  window.addEventListener("open-payment", (e: any) => {
    setPkg(e.detail);
    (document.getElementById("payment-modal") as any).showModal();
  });

  const initiate = async () => {
    if (!phone || !pkg) return;
    setLoading(true);

    const endpoint = `/api/${provider}/initiate`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, amount: pkg.price, packageId: pkg.id }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Check your phone for payment prompt!");
    } else {
      alert("Payment failed: " + (data.error || "Try again"));
    }
    setLoading(false);
    closePaymentModal();
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
      </div>
    </dialog>
  );
}
