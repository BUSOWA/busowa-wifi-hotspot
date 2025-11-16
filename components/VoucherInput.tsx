// components/VoucherInput.tsx
"use client";
import { useState } from "react";

export default function VoucherInput() {
  const [code, setCode] = useState("");

  const handleLogin = async () => {
    if (!code) return alert("Enter voucher code");
    // Call your validate API
    const res = await fetch("/api/vouchers/validate", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    alert(data.valid ? "Connected!" : "Invalid code");
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-8">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter your voucher code"
          className="input input-bordered flex-1"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button onClick={handleLogin} className="btn btn-success text-white">
          Login
        </button>
      </div>
      <a href="#" className="link link-primary text-sm mt-2 block text-center">
        Already bought? Find My Voucher
      </a>
    </div>
  );
}
