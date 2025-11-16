// components/PaymentModal.tsx
"use client";
import { useState } from "react";
import { closePaymentModal } from "@/lib/modal";

export default function PaymentModal() {
  const [phone, setPhone] = useState("");
  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  window.addEventListener("open-payment", (e: any) => {
    setPkg(e.detail);
    (document.getElementById("payment-modal") as any).showModal();
  });

  const initiate = async () => {
    setLoading(true);
    const res = await fetch("/api/airtel/initiate", {
      method: "POST",
      body: JSON.stringify({ phone, amount: pkg.price, packageId: pkg.id }),
    });
    const data = await res.json();
    alert(data.success ? "Check your phone!" : data.error);
    setLoading(false);
    closePaymentModal();
  };

  return (
    <dialog id="payment-modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirm Payment</h3>
        {pkg && <p className="py-2">{pkg.title} – UGX {pkg.price}</p>}
        <input
          type="tel"
          placeholder="07xx xxx xxx"
          className="input input-bordered w-full mt-4"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <div className="modal-action">
          <button className="btn" onClick={closePaymentModal}>Cancel</button>
          <button className="btn btn-success" onClick={initiate} disabled={loading}>
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
