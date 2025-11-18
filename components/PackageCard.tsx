// components/PackageCard.tsx
"use client";
import { openPaymentModal } from "../lib/modal";

export default function PackageCard({ pkg }: { pkg: any }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center">
      <div>
        <h3 className="font-bold text-gray-800">{pkg.title}</h3>
        {pkg.unlimited && <span className="text-xs text-green-600">UNLIMITED</span>}
        <p className="text-sm text-gray-600">{pkg.hours} Hours</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-green-700">UGX {pkg.price}</p>
        <button
          onClick={() => openPaymentModal(pkg)}
          className="mt-2 px-6 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700"
        >
          BUY
        </button>
      </div>
    </div>
  );
}
