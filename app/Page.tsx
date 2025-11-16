// app/page.tsx
import PackageCard from "@/components/PackageCard";
import VoucherInput from "@/components/VoucherInput";
import PaymentModal from "@/components/PaymentModal";
import { packages } from "@/data/packages";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white px-4 py-8">
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold leading-tight">
          BUSOWA<br/>WIFI
        </div>
        <h1 className="text-2xl font-bold text-green-800 mt-2">BUSOWA WIFI HOTSPOT</h1>
      </div>

      {/* Voucher Login */}
      <VoucherInput />

      {/* Packages */}
      <section className="mt-12 space-y-4">
        <h2 className="text-center text-lg font-semibold text-gray-700 mb-6">
          Select a package and pay with Mobile Money
        </h2>
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </section>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-gray-500">
        <p>Need help? Contact support:</p>
        <p className="font-mono">+256 781280406 / +256 782528038</p>
        <p className="mt-2">MAC: 0E:F1:CA:4C:F1:36</p>
        <p className="mt-1">Powered by XenFi</p>
      </footer>

      <PaymentModal />
    </main>
  );
}
