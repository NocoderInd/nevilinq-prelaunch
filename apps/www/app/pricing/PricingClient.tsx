"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

/** Brand (LOCKED) */
const BRAND = {
  primary: "#030027",
  accent: "#C16E70",
  surface: "#F2F3D9",
  text: "#0E1324",
  bg: "#F7F8FA",
  border: "#E6E9F1",
} as const;

/**
 * Country config
 * - multiplier: PPP factor vs India (placeholder; drive via MCP in prod)
 * - currency/locale: used for display + FX
 */
const COUNTRY_CONFIG: Record<
  string,
  { name: string; currency: keyof typeof FX_UNITS_PER_INR; locale: string; multiplier: number }
> = {
  IN: { name: "India", currency: "INR", locale: "en-IN", multiplier: 1.0 },
  US: { name: "United States", currency: "USD", locale: "en-US", multiplier: 2.0 },
  GB: { name: "United Kingdom", currency: "GBP", locale: "en-GB", multiplier: 2.1 },
  EU: { name: "European Union", currency: "EUR", locale: "en-IE", multiplier: 1.8 },
  AE: { name: "United Arab Emirates", currency: "AED", locale: "en-AE", multiplier: 1.6 },
  SG: { name: "Singapore", currency: "SGD", locale: "en-SG", multiplier: 1.7 },
  ID: { name: "Indonesia", currency: "IDR", locale: "id-ID", multiplier: 0.6 },
  NG: { name: "Nigeria", currency: "NGN", locale: "en-NG", multiplier: 0.5 },
};

/**
 * FX table — currency UNITS per 1 INR (approx; replace via MCP/API in prod)
 * Example: USD: 1 INR ≈ 0.01143 USD (i.e., 1 USD ≈ 87.5 INR)
 */
const FX_UNITS_PER_INR = {
  INR: 1,                 // 1 INR = 1 INR
  USD: 1 / 87.5,          // 0.01143
  EUR: 1 / 95.0,          // 0.01053
  GBP: 1 / 111.0,         // 0.00901
  AED: 1 / 23.9,          // 0.04184
  SGD: 1 / 65.0,          // 0.01538
  IDR: 190,               // 1 INR ~ 190 IDR
  NGN: 18,                // 1 INR ~ 18 NGN (volatile; placeholder)
} as const;

/** India base pricing (INR) — annual unless noted */
const INR_BASE = {
  bundles: { three: 3600, five: 5400, twelve: 10800 }, // /year
  businessNumber: 2499, // /year
  importExport: 5499,   // /year
  boostDaily: { basic: 89, max: 129, promax: 199 }, // per day
} as const;

type DurationKey = "daily" | "weekly" | "15days" | "monthly";
const DURATION_MULTIPLIER: Record<DurationKey, number> = {
  daily: 1,
  weekly: 7,
  "15days": 15,
  monthly: 30,
};

function cn(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}

/** Convert an INR amount to target currency after PPP scaling */
function convertINRToCurrency(inrAmount: number, currency: keyof typeof FX_UNITS_PER_INR) {
  const units = FX_UNITS_PER_INR[currency] ?? 1;
  return inrAmount * units;
}

function formatMoney(value: number, currency: keyof typeof FX_UNITS_PER_INR, locale: string) {
  // Show 0 decimals for INR/IDR (very large numbers), 2 for others
  const decimals = currency === "INR" || currency === "IDR" ? 0 : 2;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

function LogoMark() {
  return (
    <Link href="/" className="inline-flex items-center gap-2">
      <span className="inline-flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.accent }} />
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.primary }} />
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.accent }} />
      </span>
      <span className="font-semibold tracking-wide" style={{ color: BRAND.primary }}>
        NEVILINQ
      </span>
    </Link>
  );
}

export default function PricingClient({ initialCountry }: { initialCountry: string }) {
  const [country, setCountry] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ne_country") || initialCountry || "IN";
    }
    return initialCountry || "IN";
  });

  useEffect(() => {
    localStorage.setItem("ne_country", country);
  }, [country]);

  const cfg = useMemo(() => COUNTRY_CONFIG[country] ?? COUNTRY_CONFIG["IN"], [country]);

  // —— Annual bundles in INR → PPP → convert to currency ——
  const bundlesInCurrency = useMemo(() => {
    const m = cfg.multiplier;
    const threeINR = INR_BASE.bundles.three * m;
    const fiveINR = INR_BASE.bundles.five * m;
    const twelveINR = INR_BASE.bundles.twelve * m;
    return {
      three: convertINRToCurrency(threeINR, cfg.currency),
      five: convertINRToCurrency(fiveINR, cfg.currency),
      twelve: convertINRToCurrency(twelveINR, cfg.currency),
    };
  }, [cfg]);

  const businessNumberPrice = useMemo(() => {
    const inr = INR_BASE.businessNumber * cfg.multiplier;
    return convertINRToCurrency(inr, cfg.currency);
  }, [cfg]);

  const importExportPrice = useMemo(() => {
    const inr = INR_BASE.importExport * cfg.multiplier;
    return convertINRToCurrency(inr, cfg.currency);
  }, [cfg]);

  // —— Boosting: per-day in INR → PPP → convert; totals multiply by duration days ——
  const [duration, setDuration] = useState<DurationKey>("daily");
  const boost = useMemo(() => {
    const days = DURATION_MULTIPLIER[duration];
    const m = cfg.multiplier;

    const perDay = {
      basic: convertINRToCurrency(INR_BASE.boostDaily.basic * m, cfg.currency),
      max: convertINRToCurrency(INR_BASE.boostDaily.max * m, cfg.currency),
      promax: convertINRToCurrency(INR_BASE.boostDaily.promax * m, cfg.currency),
    };
    const total = {
      basic: perDay.basic * days,
      max: perDay.max * days,
      promax: perDay.promax * days,
    };
    return { perDay, total };
  }, [duration, cfg]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.bg, color: BRAND.text }}>
      {/* Header */}
      <header
        className="sticky top-0 z-20 border-b bg-white/70 backdrop-blur"
        style={{ borderColor: BRAND.border }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <LogoMark />
          <div className="flex items-center gap-3">
            <CountrySelect country={country} setCountry={setCountry} />
            <Link
              href="/auth/login"
              className="rounded-xl px-4 py-2 font-medium shadow-sm"
              style={{ background: `linear-gradient(90deg,#6366F1,#22D3EE)`, color: "white" }}
            >
              List here boss
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-bold md:text-3xl" style={{ color: BRAND.primary }}>
          Transparent pricing that scales with you
        </h1>
        <p className="mt-2 max-w-2xl text-sm md:text-base" style={{ color: "#475069" }}>
          Prices = <b>India base (INR) × PPP multiplier → FX convert</b>. Your first group is always
          free—when you buy any bundle, that free group is added to your bundle.
          <b> All bundle prices are annual (1 year).</b>
        </p>
      </section>

      {/* Bundles (Annual) */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="mb-3 text-xs font-medium text-emerald-700">
          ✅ 1st group free • added to any purchased bundle • <b>Bundles are for 1 year</b>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <PlanCard
            title="3 Groups / Channels"
            price={formatMoney(bundlesInCurrency.three, cfg.currency, cfg.locale)}
            period="/year"
            badge="Starter"
            bullets={[
              "Any mix: WhatsApp/Telegram",
              "Annual platform license (1 year)",
              "Verified badge support",
            ]}
          />
          <PlanCard
            title="5 Groups / Channels"
            price={formatMoney(bundlesInCurrency.five, cfg.currency, cfg.locale)}
            period="/year"
            badge="Growth"
            highlight
            bullets={[
              "Best value for scaling",
              "Annual platform license (1 year)",
              "Boost eligible",
            ]}
          />
          <PlanCard
            title="12 Groups / Channels"
            price={formatMoney(bundlesInCurrency.twelve, cfg.currency, cfg.locale)}
            period="/year"
            badge="Pro"
            bullets={[
              "Serious creators & brands",
              "Annual platform license (1 year)",
              "Priority review",
            ]}
          />
        </div>

        <div
          className="mt-4 rounded-xl p-3 text-xs"
          style={{ backgroundColor: BRAND.surface, border: `1px dashed ${BRAND.border}` }}
        >
          <b>Note:</b> A <i>bundle</i> can be any combination of groups and channels (or all groups / all
          channels). Your free group is included once you purchase any bundle. All bundles renew yearly.
        </div>
      </section>

      {/* Listings (Annual) */}
      <section className="mx-auto mt-10 max-w-6xl px-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FeaturePriceCard
            title="Business Number Listing (WhatsApp / Telegram) — 1 year"
            price={formatMoney(businessNumberPrice, cfg.currency, cfg.locale)}
            desc="List your WhatsApp or Telegram business number. Get discovered on Google, Bing & Perplexity with SEO-optimized pages."
            ctaLabel="List business number"
            href="/auth/login"
          />
          <FeaturePriceCard
            title="Import & Export Listing — 1 year"
            price={formatMoney(importExportPrice, cfg.currency, cfg.locale)}
            desc="Showcase verified buyers/sellers. KYC alert before first contact as per gov norms."
            ctaLabel="Start listing"
            href="/auth/login"
          />
        </div>
      </section>

      {/* Boosting */}
      <section className="mx-auto mt-12 max-w-6xl px-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold" style={{ color: BRAND.primary }}>
            Boosting Plans
          </h2>
          <DurationToggle value={duration} onChange={setDuration} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <BoostCard
            name="Basic"
            perDay={formatMoney(boost.perDay.basic, cfg.currency, cfg.locale)}
            total={formatMoney(boost.total.basic, cfg.currency, cfg.locale)}
            durationLabel={labelForDuration(duration)}
          />
          <BoostCard
            name="Max"
            highlight
            perDay={formatMoney(boost.perDay.max, cfg.currency, cfg.locale)}
            total={formatMoney(boost.total.max, cfg.currency, cfg.locale)}
            durationLabel={labelForDuration(duration)}
          />
          <BoostCard
            name="Pro Max"
            perDay={formatMoney(boost.perDay.promax, cfg.currency, cfg.locale)}
            total={formatMoney(boost.total.promax, cfg.currency, cfg.locale)}
            durationLabel={labelForDuration(duration)}
          />
        </div>

        <p className="mt-3 text-xs" style={{ color: "#5D6473" }}>
          Boosts surface your group/channel/listing in category & search. Durations are calculated from daily base rates (PPP-adjusted, then FX-converted).
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-xs" style={{ borderColor: BRAND.border }}>
        © {new Date().getFullYear()} NEVILINQ • Privacy • Terms • Refund Policy
      </footer>
    </div>
  );
}

/* ————— UI Bits ————— */

function PlanCard({
  title,
  price,
  period = "/year",
  bullets,
  badge,
  highlight = false,
}: {
  title: string;
  price: string;
  period?: string;
  bullets: string[];
  badge: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn("rounded-2xl border p-5 shadow-sm", highlight ? "ring-2" : "")}
      style={{
        borderColor: BRAND.border,
        background: "white",
        boxShadow: highlight ? "0 8px 24px rgba(3,0,39,0.08)" : undefined,
        outline: highlight ? `2px solid ${BRAND.primary}` : undefined,
        outlineOffset: highlight ? 2 : undefined,
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold" style={{ color: BRAND.primary }}>
          {title}
        </h3>
        <span
          className="rounded-full px-2 py-0.5 text-xs"
          style={{ backgroundColor: BRAND.surface, color: BRAND.primary, border: `1px solid ${BRAND.border}` }}
        >
          {badge}
        </span>
      </div>
      <div className="mb-4 flex items-baseline gap-1">
        <span className="text-2xl font-bold">{price}</span>
        <span className="text-sm text-slate-500">{period}</span>
      </div>
      <ul className="mb-5 space-y-2 text-sm text-slate-600">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: BRAND.accent }} />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/auth/login"
        className="block w-full rounded-xl px-4 py-2 text-center font-medium"
        style={{ background: `linear-gradient(90deg,#6366F1,#22D3EE)`, color: "white" }}
      >
        Choose bundle
      </Link>
    </div>
  );
}

function FeaturePriceCard({
  title,
  price,
  desc,
  ctaLabel,
  href,
}: {
  title: string;
  price: string;
  desc: string;
  ctaLabel: string;
  href: string;
}) {
  return (
    <div
      className="rounded-2xl border p-5 shadow-sm"
      style={{ borderColor: BRAND.border, backgroundColor: "white" }}
    >
      <h3 className="text-lg font-semibold" style={{ color: BRAND.primary }}>
        {title}
      </h3>
      <div className="mt-1 text-2xl font-bold">{price}</div>
      <p className="mt-3 text-sm text-slate-600">{desc}</p>
      <Link
        href={href}
        className="mt-4 inline-block rounded-xl px-4 py-2 font-medium"
        style={{ background: `linear-gradient(90deg,#6366F1,#22D3EE)`, color: "white" }}
      >
        {ctaLabel}
      </Link>
    </div>
  );
}

function DurationToggle({
  value,
  onChange,
}: {
  value: DurationKey;
  onChange: (v: DurationKey) => void;
}) {
  const options: { key: DurationKey; label: string }[] = [
    { key: "daily", label: "Daily" },
    { key: "weekly", label: "Weekly" },
    { key: "15days", label: "15 Days" },
    { key: "monthly", label: "Monthly" },
  ];
  return (
    <div
      className="inline-flex rounded-full border p-1"
      style={{ borderColor: BRAND.border, backgroundColor: "white" }}
    >
      {options.map((o) => {
        const active = o.key === value;
        return (
          <button
            key={o.key}
            onClick={() => onChange(o.key)}
            className={cn("rounded-full px-3 py-1 text-xs font-medium", active ? "shadow" : "")}
            style={{
              backgroundColor: active ? BRAND.surface : "transparent",
              color: active ? BRAND.primary : "#5D6473",
              border: active ? `1px solid ${BRAND.border}` : "none",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function BoostCard({
  name,
  perDay,
  total,
  durationLabel,
  highlight = false,
}: {
  name: "Basic" | "Max" | "Pro Max";
  perDay: string;
  total: string;
  durationLabel: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn("rounded-2xl border p-5 shadow-sm", highlight ? "ring-2" : "")}
      style={{
        borderColor: BRAND.border,
        backgroundColor: "white",
        boxShadow: highlight ? "0 8px 24px rgba(3,0,39,0.08)" : undefined,
        outline: highlight ? `2px solid ${BRAND.primary}` : undefined,
        outlineOffset: highlight ? 2 : undefined,
      }}
    >
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-lg font-semibold" style={{ color: BRAND.primary }}>
          {name}
        </h3>
        <span
          className="rounded-full px-2 py-0.5 text-xs"
          style={{ backgroundColor: BRAND.surface, color: BRAND.primary, border: `1px solid ${BRAND.border}` }}
        >
          Boost
        </span>
      </div>
      <div className="text-sm text-slate-600">From {perDay} / day</div>
      <div className="mt-3 text-2xl font-bold">{total}</div>
      <div className="text-xs text-slate-500">{durationLabel} total</div>
      <Link
        href="/auth/login"
        className="mt-4 inline-block rounded-xl px-4 py-2 font-medium"
        style={{ background: `linear-gradient(90deg,#6366F1,#22D3EE)`, color: "white" }}
      >
        Boost now
      </Link>
    </div>
  );
}

function labelForDuration(d: DurationKey) {
  switch (d) {
    case "daily":
      return "1 day";
    case "weekly":
      return "7 days";
    case "15days":
      return "15 days";
    case "monthly":
      return "30 days";
  }
}

function CountrySelect({
  country,
  setCountry,
}: {
  country: string;
  setCountry: (c: string) => void;
}) {
  const codes = Object.keys(COUNTRY_CONFIG);
  return (
    <label className="inline-flex items-center gap-2 text-xs">
      <span className="text-slate-600">Country</span>
      <select
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className="rounded-lg border px-2 py-1"
        style={{ borderColor: BRAND.border }}
      >
        {codes.map((c) => (
          <option key={c} value={c}>
            {c} — {COUNTRY_CONFIG[c].name}
          </option>
        ))}
      </select>
    </label>
  );
}
