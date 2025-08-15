// apps/www/app/boost/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const BRAND = {
  primary: "#030027",
  accent: "#C16E70",
  surface: "#F2F3D9",
  text: "#0E1324",
  bg: "#F7F8FA",
  border: "#E6E9F1",
} as const;

type BoostPrice = {
  id: "daily" | "weekly" | "15days" | "30days";
  label: string;
  priceINR: number;
  localCurrency: string;
  priceLocal: number;
  displayLocal: string;
  displayINR: string;
};

type ApiResp = {
  countryCode: string;
  currency: string;
  plans: BoostPrice[];
  notes: string[];
};

const COUNTRIES = [
  "IN","US","GB","CA","AU","SG","AE","SA","JP","KR",
  "DE","FR","IT","ES","BR","MX","ZA","NG","TH","MY","ID","PH","VN","TR"
];

export default function BoostPricingPage() {
  const [country, setCountry] = useState<string>("");
  const [data, setData] = useState<ApiResp | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (cc?: string) => {
    setLoading(true);
    const qs = cc ? `?country=${encodeURIComponent(cc)}` : "";
    const res = await fetch(`/api/pricing/boost${qs}`, { cache: "no-store" });
    const json: ApiResp = await res.json();
    setData(json);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const header = useMemo(() => {
    return (
      <header className="sticky top-0 z-10 w-full border-b bg-white" style={{ borderColor: BRAND.border }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          {/* Mini Logo (3 dots + wordmark) */}
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.accent }} />
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.primary }} />
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.accent }} />
            </span>
            <span className="font-semibold tracking-wide" style={{ color: BRAND.primary }}>NEVILINQ</span>
          </Link>

          <div className="flex items-center gap-3">
            <select
              value={country}
              onChange={(e) => { setCountry(e.target.value); fetchData(e.target.value); }}
              className="rounded-xl border px-3 py-2 text-sm"
              style={{ borderColor: BRAND.border }}
              aria-label="Country override"
            >
              <option value="">Auto-detect</option>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <Link
              href="/dashboard"
              className="rounded-xl px-3 py-2 text-sm font-medium"
              style={{ background: BRAND.primary, color: "white" }}
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </header>
    );
  }, [country]);

  return (
    <div className="min-h-screen" style={{ background: BRAND.bg, color: BRAND.text }}>
      {header}

      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold" style={{ color: BRAND.primary }}>
          Boost Plans — Country‑wise Pricing
        </h1>
        <p className="mb-6 text-sm opacity-80">
          Pricing is derived from India base (PPP‑adjusted) and then converted to your local currency.
        </p>

        {loading && <div className="rounded-lg border p-4" style={{ borderColor: BRAND.border }}>Loading…</div>}

        {!loading && data && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.plans.map((p) => (
              <div key={p.id} className="rounded-2xl border p-4 shadow-sm" style={{ borderColor: BRAND.border, background: "white" }}>
                <div className="mb-2 text-sm font-medium opacity-70">{p.label}</div>
                <div className="mb-1 text-xl font-semibold">{p.displayLocal}</div>
                <div className="mb-4 text-xs opacity-60">≈ {p.displayINR} (PPP‑adjusted)</div>
                <button
                  className="w-full rounded-xl px-3 py-2 font-medium"
                  style={{ background: BRAND.accent, color: "white" }}
                >
                  Boost now
                </button>
              </div>
            ))}
          </div>
        )}

        {!loading && data?.notes?.length ? (
          <ul className="mt-6 list-disc space-y-1 pl-5 text-xs opacity-75">
            {data.notes.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        ) : null}
      </main>
    </div>
  );
}
