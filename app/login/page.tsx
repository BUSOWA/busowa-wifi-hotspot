// app/login/page.tsx
import Image from "next/image";
import PackageCard from "../../components/PackageCard";
import VoucherInput from "../../components/VoucherInput";
import PaymentModal from "../../components/PaymentModal";
import { packages } from "../../data/packages";

// ←←← ADD THIS ONE LINE ONLY
export const dynamic = 'force-dynamic';   // This solves the MikroTik redirect problem forever

export default function LoginPage() {
  // … everything else stays exactly the same
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white px-4 py-8">
      {/* Header – WiFi Icon */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
          WiFi
        </div>
        <h1 className="text-2xl font-bold text-green-800 mt-2">BUSOWA WIFI HOTSPOT</h1>
      </div>

      <VoucherInput />

      <section className="mt-12 space-y-4">
        <h2 className="text-center text-lg font-semibold text-gray-700 mb-6">
          Select a package and pay with Mobile Money
        </h2>
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </section>

      <footer className="mt-12 text-center text-xs text-yellow-600 bg-yellow-50 py-4 rounded-lg border border-yellow-200">
        <p className="text-yellow-700 font-medium">Need help? Contact support:</p>
        <p className="font-mono text-yellow-800 font-semibold">0758266233 / 0702578781</p>
        <p className="mt-1 text-yellow-700">MAC: 0E:F1:CA:4C:F1:36</p>
        <p className="mt-1 text-yellow-700 font-medium">Developed and Powered by Zeex Group [0755772114]</p>
      </footer>

      <PaymentModal />
    </main>
  );
}
