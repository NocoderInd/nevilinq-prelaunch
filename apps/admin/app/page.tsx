// apps/admin/app/page.tsx
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Users,
  MessageSquareText,
  Store,
  Rocket,
  BarChart2 as BarChart,
  CreditCard,
  ShieldCheck,
  Settings,
  Hash,
  Database,
} from "lucide-react";

/** NEVILINQ Brand (LOCKED) */
const BRAND = {
  primary: "#030027",
  accent: "#C16E70",
  surface: "#F2F3D9",
  text: "#0E1324",
  bg: "#F7F8FA",
  border: "#E6E9F1",
} as const;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

type HealthResp = { ok?: boolean; service?: string } | null;

async function getHealth(): Promise<HealthResp> {
  noStore();
  try {
    const res = await fetch(`${API_BASE}/healthz`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as HealthResp;
  } catch {
    return null;
  }
}

function Card({
  href,
  title,
  desc,
  Icon,
}: {
  href: string;
  title: string;
  desc: string;
  Icon: LucideIcon;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-[#E6E9F1] bg-white p-5 shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C16E70]/40"
    >
      <div className="flex items-start gap-4">
        <div className="rounded-xl border border-[#E6E9F1] p-3 shadow-sm">
          <Icon className="h-6 w-6" aria-hidden />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-[#0E1324]">{title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-[#4B5563]">{desc}</p>
        </div>
        <div className="ms-auto self-center text-xs font-medium text-[#6B7280] group-hover:text-[#0E1324]">
          Open →
        </div>
      </div>
    </Link>
  );
}

export default async function AdminHome() {
  const health = await getHealth();
  const ok = !!health?.ok;

  const styleVars: CSSProperties = {
    "--bg": BRAND.bg,
    "--text": BRAND.text,
    "--accent": BRAND.accent,
    "--primary": BRAND.primary,
    "--border": BRAND.border,
  } as CSSProperties;

  return (
    <main className="min-h-dvh bg-[var(--bg)]" style={styleVars}>
      {/* Header */}
      <section className="border-b border-[var(--border)] bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
                NEVILINQ — Admin
              </h1>
              <p className="mt-1 text-sm text-[#6B7280]">
                Internal control panel for staff. Manage users, groups, listings, boosts, billing & more.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${
                  ok
                    ? "border-emerald-200 text-emerald-700 bg-emerald-50"
                    : "border-rose-200 text-rose-700 bg-rose-50"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    ok ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                />
                API {ok ? "Online" : "Offline"}
              </span>
              <code className="rounded-lg border border-[var(--border)] bg-white px-3 py-1 text-xs text-[#4B5563]">
                {API_BASE.replace(/^https?:\/\//, "")}/healthz
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Quick stats row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#6B7280]">Total Users</p>
              <Users className="h-4 w-4" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-[var(--text)]">—</p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#6B7280]">Active Groups</p>
              <Hash className="h-4 w-4" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-[var(--text)]">—</p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#6B7280]">Boosted Listings</p>
              <Rocket className="h-4 w-4" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-[var(--text)]">—</p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#6B7280]">Revenue (₹)</p>
              <CreditCard className="h-4 w-4" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-[var(--text)]">—</p>
          </div>
        </div>

        {/* Primary grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card
            href="/users"
            title="Users"
            desc="View, verify, suspend, or reset credentials."
            Icon={Users}
          />
          <Card
            href="/groups"
            title="Groups & Channels"
            desc="Manage WhatsApp/Telegram groups and channels."
            Icon={MessageSquareText}
          />
          <Card
            href="/business"
            title="Business Listings"
            desc="Approve services, handle takedowns, and disputes."
            Icon={Store}
          />
          <Card
            href="/boosts"
            title="Boost Plans"
            desc="Create & assign boosts. Country-wise pricing supported."
            Icon={Rocket}
          />
          <Card
            href="/reports"
            title="Reports & Analytics"
            desc="Traffic, sales, cohort trends, and fraud alerts."
            Icon={BarChart}
          />
          <Card
            href="/billing"
            title="Billing & Payouts"
            desc="Platform fees, commissions, invoices, refunds."
            Icon={CreditCard}
          />
          <Card
            href="/compliance"
            title="Trust & Compliance"
            desc="KYC, verified badges, abuse and DMCA queue."
            Icon={ShieldCheck}
          />
          <Card
            href="/infrastructure"
            title="Infrastructure"
            desc="Bots, SIM rotation logs, API keys, webhooks."
            Icon={Database}
          />
          <Card
            href="/settings"
            title="Settings"
            desc="Admins, roles, access controls, feature flags."
            Icon={Settings}
          />
        </div>

        {/* Activity placeholder */}
        <div className="mt-8 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[var(--text)]">Recent Activity</h2>
            <Link href="/reports" className="text-sm font-medium text-[var(--accent)] hover:underline">
              View all
            </Link>
          </div>
          <ol className="mt-4 space-y-3 text-sm text-[#4B5563]">
            <li className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-white px-4 py-3">
              <div className="flex items-center gap-3">
                <Rocket className="h-4 w-4" />
                Boost plan updated for 🇮🇳 India (Starter → Growth)
              </div>
              <span className="text-xs text-[#6B7280]">just now</span>
            </li>
            <li className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-white px-4 py-3">
              <div className="flex items-center gap-3">
                <Store className="h-4 w-4" />
                New business listing pending review: “Hyderabad Tuitions”
              </div>
              <span className="text-xs text-[#6B7280]">2h</span>
            </li>
            <li className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-white px-4 py-3">
              <div className="flex items-center gap-3">
                <MessageSquareText className="h-4 w-4" />
                Report flagged on group “IAS Prep 2025”
              </div>
              <span className="text-xs text-[#6B7280]">4h</span>
            </li>
          </ol>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-white/70 py-4 text-center text-xs text-[#6B7280]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} NEVILINQ • Internal Admin
        </div>
      </footer>
    </main>
  );
}
