export default function PricingBoostsPage() {
  return (
    <main>
      <h1 className="mb-4 text-xl font-semibold">Pricing & Boosts</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-4" style={{ borderColor: "#E6E9F1" }}>
          <div className="text-sm font-semibold">3 Groups</div>
          <div className="text-2xl font-bold mt-1">₹3,800 / year</div>
          <a href="/checkout?bundle=3" className="mt-3 inline-block rounded-xl border px-3 py-2 text-sm" style={{ borderColor: "#E6E9F1" }}>Choose</a>
        </div>
        {/* add 5 & 12 bundles similarly and daily/weekly/15/30-day boosts */}
      </div>
    </main>
  );
}
