// Add provider selector
const [provider, setProvider] = useState<"airtel" | "mtn">("mtn");

<div className="flex gap-2 mt-4">
  <button
    onClick={() => setProvider("airtel")}
    className={`flex-1 btn ${provider === "airtel" ? "btn-success" : "btn-outline"}`}
  >
    <img src="/airtel.png" alt="Airtel" className="w-5 h-5" /> Airtel
  </button>
  <button
    onClick={() => setProvider("mtn")}
    className={`flex-1 btn ${provider === "mtn" ? "btn-success" : "btn-outline"}`}
  >
    <img src="/mtn.png" alt="MTN" className="w-5 h-5" /> MTN
  </button>
</div>
