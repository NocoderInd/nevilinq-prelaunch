"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  BarChart2,
  TrendingUp,
  Users2,
  Wallet,
  Rocket,
  LineChart as LineChartIcon,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
} from "recharts";

/** BRAND (LOCKED) */
const BRAND = {
  primary: "#030027", // Oxford Blue
  accent: "#C16E70", // Old Rose
  surface: "#F2F3D9", // Beige
  text: "#0E1324",
  bg: "#F7F8FA",
  border: "#E6E9F1",
} as const;

/**
 * AnalyticsPage — self‑contained dashboard analytics view.
 *
 * ✅ No external UI libs beyond Tailwind, lucide-react, recharts
 * ✅ Fully responsive, a11y-friendly, keyboard navigable
 * ✅ Clear sections: KPIs, Trends, Breakdown, Top Entities
 * ✅ Easy to wire to real API later (replace MOCK_* with API data)
 * ✅ Follows Refactoring UI principles (hierarchy, spacing, contrast)
 */
export default function AnalyticsPage() {
  /**
   * In production, replace the below with a hook (SWR/React Query) that
   * calls your API: GET /api/analytics?from=...&to=...&tz=Asia/Kolkata
   */
  const [range, setRange] = useState<
    "7d" | "14d" | "30d" | "90d" | "YTD"
  >("30d");

  const MOCK_SERIES = useMemo(() => getMockSeries(range), [range]);
  const MOCK_KPIS = useMemo(() => getMockKpis(MOCK_SERIES), [MOCK_SERIES]);
  const MOCK_BREAKDOWN = useMemo(() => getMockBreakdown(MOCK_SERIES), [
    MOCK_SERIES,
  ]);
  const MOCK_TOP = useMemo(() => getMockTopEntities(), []);

  return (
    <main className="min-h-screen w-full bg-[var(--bg)] px-4 pb-16 sm:px-6 lg:px-8" style={{
      // CSS variables so child elements can use them in inline styles
      // while keeping the palette centralized
      // (helps avoid TS complaints about arbitrary values)
      // @ts-ignore
      "--bg": BRAND.bg,
      "--surface": BRAND.surface,
      "--text": BRAND.text,
      "--border": BRAND.border,
      "--primary": BRAND.primary,
      "--accent": BRAND.accent,
    }}>
      {/* Header */}
      <div className="sticky top-0 z-40 -mx-4 mb-6 border-b bg-[var(--bg)]/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-[var(--bg)]/80 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mini logo (matches landing three dots) */}
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.accent }} />
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.primary }} />
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.accent }} />
            </span>
            <h1 className="text-base font-semibold tracking-tight text-[var(--text)] sm:text-lg">
              Analytics
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <RangePills value={range} onChange={setRange} />
            <button
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm font-medium text-[var(--text)] shadow-sm transition hover:shadow"
              onClick={() => exportCSV(MOCK_SERIES)}
              aria-label="Download CSV"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 md:gap-6">
        {/* KPI Row */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Active Groups"
            value={formatNumber(MOCK_KPIS.activeGroups)}
            delta={MOCK_KPIS.activeGroupsDelta}
            icon={<Users2 className="h-5 w-5" />}
          />
          <KpiCard
            title="New Joins"
            value={formatNumber(MOCK_KPIS.newJoins)}
            delta={MOCK_KPIS.newJoinsDelta}
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <KpiCard
            title="Boost Revenue"
            value={formatCurrency(INR(MOCK_KPIS.boostRevenue))}
            delta={MOCK_KPIS.boostRevenueDelta}
            icon={<Rocket className="h-5 w-5" />}
          />
          <KpiCard
            title="Platform Fee"
            value={formatCurrency(INR(MOCK_KPIS.platformFee))}
            delta={MOCK_KPIS.platformFeeDelta}
            icon={<Wallet className="h-5 w-5" />}
          />
        </section>

        {/* Trends */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card title="Revenue Trend" subtitle="Boosts + Platform Fee" className="lg:col-span-2">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_SERIES} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={BRAND.primary} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={BRAND.primary} stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="revB" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={BRAND.accent} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={BRAND.accent} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAECEF" />
                  <XAxis dataKey="d" fontSize={12} tickMargin={8} />
                  <YAxis fontSize={12} tickFormatter={(v: number) => `₹${Math.round(v/1000)}k`} width={46} />
                  <Tooltip formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`} />
                  <Legend />
                  <Area type="monotone" dataKey="boostRevenue" name="Boosts" stroke={BRAND.accent} fill="url(#revB)" strokeWidth={2} />
                  <Area type="monotone" dataKey="platformFee" name="Platform Fee" stroke={BRAND.primary} fill="url(#revA)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card title="Joins Trend" subtitle="Daily new members">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_SERIES} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAECEF" />
                  <XAxis dataKey="d" fontSize={12} tickMargin={8} />
                  <YAxis fontSize={12} width={36} />
                  <Tooltip />
                  <Line type="monotone" dataKey="joins" stroke={BRAND.primary} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>

        {/* Breakdown */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card title="Breakdown by Type" subtitle="Groups vs Channels vs Business Numbers" className="lg:col-span-2">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_BREAKDOWN} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAECEF" />
                  <XAxis dataKey="label" fontSize={12} tickMargin={8} />
                  <YAxis fontSize={12} width={36} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="# Listings" radius={[8, 8, 0, 0]} fill={BRAND.primary} />
                  <Bar dataKey="joins" name="Joins" radius={[8, 8, 0, 0]} fill={BRAND.accent} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Key Ratios" subtitle="Quality & conversion quick view">
            <ul className="space-y-3">
              <RatioItem label="Join Conversion" value={`${pct(MOCK_KPIS.joinConversion)}%`} good />
              <RatioItem label="Boost Take‑Rate" value={`${pct(MOCK_KPIS.boostTakeRate)}%`} good={MOCK_KPIS.boostTakeRate > 0.1} />
              <RatioItem label="Verified Share" value={`${pct(MOCK_KPIS.verifiedShare)}%`} good={MOCK_KPIS.verifiedShare > 0.6} />
              <RatioItem label="Avg. Revenue / Admin" value={formatCurrency(INR(MOCK_KPIS.arpa))} />
            </ul>
          </Card>
        </section>

        {/* Top Entities */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card title="Top Performing Listings" subtitle="By joins in range">
            <div className="divide-y divide-[var(--border)]">
              {MOCK_TOP.map((t) => (
                <div key={t.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--text)]">{t.name}</p>
                    <p className="truncate text-xs text-neutral-500">{t.type} • {t.category}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[var(--text)]">{t.joins.toLocaleString("en-IN")}</p>
                      <p className="text-xs text-neutral-500">joins</p>
                    </div>
                    <Link href={`/entity/${t.slug}`} className="inline-flex items-center rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--text)] shadow-sm transition hover:shadow">
                      View
                      <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Revenue by Country" subtitle="Platform fee + boosts">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aggregateByCountry(MOCK_SERIES)} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAECEF" />
                  <XAxis dataKey="country" fontSize={12} />
                  <YAxis fontSize={12} tickFormatter={(v: number) => `₹${Math.round(v/1000)}k`} width={42} />
                  <Tooltip formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`} />
                  <Bar dataKey="revenue" radius={[8, 8, 0, 0]} fill={BRAND.primary} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>

        {/* Footer hint */}
        <p className="mt-6 text-center text-xs text-neutral-500">
          Tip: Replace mock builders with real API calls when ready. Keep the palette & spacing consistent.
        </p>
      </div>
    </main>
  );
}

/*** UI PRIMITIVES ***/
function Card({
  title,
  subtitle,
  className = "",
  children,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={
        "rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[0_1px_0_0_rgba(0,0,0,0.02)] sm:p-5 " +
        className
      }
    >
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text)] sm:text-base">{title}</h3>
          {subtitle ? (
            <p className="mt-0.5 text-xs text-neutral-500 sm:text-[13px]">{subtitle}</p>
          ) : null}
        </div>
        <button
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-white px-2.5 py-1.5 text-xs font-medium text-[var(--text)] shadow-sm transition hover:shadow"
          aria-label="Filter"
        >
          <Filter className="h-3.5 w-3.5" />
          Filter
        </button>
      </header>
      {children}
    </section>
  );
}

function KpiCard({
  title,
  value,
  delta,
  icon,
}: {
  title: string;
  value: string;
  delta?: number;
  icon: React.ReactNode;
}) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[0_1px_0_0_rgba(0,0,0,0.02)] sm:p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-neutral-500">{title}</p>
          <p className="mt-1 text-xl font-semibold text-[var(--text)] sm:text-2xl">{value}</p>
        </div>
        <div className="rounded-xl bg-[var(--surface)] p-2 text-[var(--text)]">
          {icon}
        </div>
      </div>
      {typeof delta === "number" && (
        <div className="mt-3 inline-flex items-center gap-1 rounded-lg bg-neutral-50 px-2 py-1 text-xs font-medium text-neutral-700">
          {positive ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
          <span className={positive ? "text-emerald-600" : "text-rose-600"}>
            {Math.abs(delta).toFixed(1)}%
          </span>
          vs prev period
        </div>
      )}
    </div>
  );
}

function RangePills({
  value,
  onChange,
}: {
  value: "7d" | "14d" | "30d" | "90d" | "YTD";
  onChange: (v: "7d" | "14d" | "30d" | "90d" | "YTD") => void;
}) {
  const options: Array<{ v: typeof value; label: string }> = [
    { v: "7d", label: "7d" },
    { v: "14d", label: "14d" },
    { v: "30d", label: "30d" },
    { v: "90d", label: "90d" },
    { v: "YTD", label: "YTD" },
  ];
  return (
    <div className="inline-flex rounded-xl border border-[var(--border)] bg-white p-1 text-sm shadow-sm">
      {options.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className={`rounded-lg px-2.5 py-1.5 font-medium transition ${
            value === o.v ? "bg-[var(--primary)] text-white" : "text-[var(--text)] hover:bg-neutral-50"
          }`}
          aria-pressed={value === o.v}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function RatioItem({ label, value, good }: { label: string; value: string; good?: boolean }) {
  return (
    <li className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-white px-3 py-2">
      <span className="text-sm text-neutral-600">{label}</span>
      <span className={`text-sm font-semibold ${good ? "text-emerald-600" : "text-[var(--text)]"}`}>{value}</span>
    </li>
  );
}

/*** DATA BUILDERS (MOCKS) ***/
function getMockSeries(range: "7d" | "14d" | "30d" | "90d" | "YTD") {
  const days = range === "7d" ? 7 : range === "14d" ? 14 : range === "30d" ? 30 : range === "90d" ? 90 : 210;
  const start = new Date();
  start.setDate(start.getDate() - (days - 1));
  const countries = ["IN", "US", "AE", "GB", "SG"] as const;

  return Array.from({ length: days }).map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    // pseudo seasonality
    const base = 200 + Math.round(40 * Math.sin(i / 3));
    const joins = base + Math.round(Math.random() * 40);
    const boostRevenue = 8000 + Math.round(Math.random() * 4000);
    const platformFee = 12000 + Math.round(Math.random() * 2000);

    // country mix — stable-ish distribution
    const mix = randomSplit(platformFee + boostRevenue, countries.length);

    return {
      d: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      joins,
      boostRevenue,
      platformFee,
      byCountry: countries.map((c, idx) => ({ country: c, revenue: mix[idx] })),
    };
  });
}

function getMockKpis(series: ReturnType<typeof getMockSeries>) {
  const sums = series.reduce(
    (acc, s) => {
      acc.joins += s.joins;
      acc.boostRevenue += s.boostRevenue;
      acc.platformFee += s.platformFee;
      return acc;
    },
    { joins: 0, boostRevenue: 0, platformFee: 0 }
  );

  const prevFactor = 0.9 + Math.random() * 0.1; // pretend previous period was slightly lower/higher
  const delta = (curr: number) => ((curr - curr * prevFactor) / (curr * prevFactor)) * 100;

  return {
    activeGroups: 1250,
    activeGroupsDelta: 3.2,
    newJoins: sums.joins,
    newJoinsDelta: delta(sums.joins),
    boostRevenue: sums.boostRevenue,
    boostRevenueDelta: delta(sums.boostRevenue),
    platformFee: sums.platformFee,
    platformFeeDelta: delta(sums.platformFee),
    joinConversion: 0.34,
    boostTakeRate: 0.18,
    verifiedShare: 0.72,
    arpa: (sums.platformFee + sums.boostRevenue) / 420, // approx admins in period
  };
}

function getMockBreakdown(series: ReturnType<typeof getMockSeries>) {
  // pretend 60/25/15 distribution of listings and joins
  const totals = series.reduce(
    (acc, s) => {
      acc.joins += s.joins;
      return acc;
    },
    { joins: 0 }
  ).joins;

  return [
    { label: "Groups", count: 680, joins: Math.round(totals * 0.6) },
    { label: "Channels", count: 280, joins: Math.round(totals * 0.25) },
    { label: "Business Numbers", count: 190, joins: Math.round(totals * 0.15) },
  ];
}

function getMockTopEntities() {
  return [
    { id: "g1", slug: "hyderabad-startups", name: "Hyderabad Startups", type: "WhatsApp Group", category: "Startups", joins: 1860 },
    { id: "g2", slug: "stock-market-tg", name: "Stock Market India", type: "Telegram Channel", category: "Finance", joins: 1432 },
    { id: "g3", slug: "it-jobs-hyd", name: "IT Jobs — HYD", type: "WhatsApp Group", category: "Careers", joins: 1278 },
    { id: "g4", slug: "digital-marketing-pro", name: "Digital Marketing Pro", type: "WhatsApp Group", category: "Marketing", joins: 990 },
    { id: "g5", slug: "foodies-hyd", name: "Foodies Hyderabad", type: "WhatsApp Group", category: "Food", joins: 812 },
  ];
}

function aggregateByCountry(series: ReturnType<typeof getMockSeries>) {
  const bucket: Record<string, number> = {};
  for (const s of series) {
    for (const c of s.byCountry) {
      bucket[c.country] = (bucket[c.country] ?? 0) + c.revenue;
    }
  }
  return Object.entries(bucket).map(([country, revenue]) => ({ country, revenue }));
}

/*** UTILS ***/
function formatNumber(n: number) {
  return new Intl.NumberFormat("en-IN").format(n);
}
function INR(n: number) {
  return n; // unit is INR already in our mocks
}
function formatCurrency(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}
function pct(n: number) {
  return Math.round(n * 100);
}
function randomSplit(total: number, parts: number) {
  const cuts = Array.from({ length: parts }, () => Math.random());
  const sum = cuts.reduce((a, b) => a + b, 0);
  return cuts.map((c) => Math.round((c / sum) * total));
}

function exportCSV(series: ReturnType<typeof getMockSeries>) {
  const rows = [
    ["date", "joins", "boostRevenue", "platformFee"],
    ...series.map((s) => [s.d, s.joins, s.boostRevenue, s.platformFee]),
  ];
  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `nevilinq-analytics-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
