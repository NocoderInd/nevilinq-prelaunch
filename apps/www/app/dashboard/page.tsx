// apps/www/app/dashboard/page.tsx
import Link from "next/link";
import {
  Users2,
  MessageSquareText,
  Store,
  Globe,
  Rocket,
  BarChart2,
  Gift,
  Wallet,
  LifeBuoy,
  ShieldCheck,
  Settings,
  UserCircle2,
  ArrowUpRight,
} from "lucide-react";

/********************
 * NEVILINQ Brand — LOCKED
 ********************/
const BRAND = {
  primary: "#030027",
  accent: "#C16E70",
  surface: "#F2F3D9",
  text: "#0E1324",
  bg: "#F7F8FA",
  border: "#E6E9F1",
} as const;

type Stat = { label: string; value: number | string; href: string; icon: React.ReactNode };
type QuickAction = { label: string; sub: string; href: string; icon: React.ReactNode };

function LogoFeature({ label, href = "/dashboard" }: { label: string; href?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm font-medium text-[#0E1324] hover:opacity-90"
      aria-label={`${label} (go to dashboard)`}
    >
      <span className="inline-flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.accent }} />
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.primary }} />
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.accent }} />
      </span>
      <span className="tracking-tight">{label}</span>
    </Link>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[${BRAND.border}] bg-white p-5 shadow-sm ${className}`}
      style={{ borderColor: BRAND.border }}
    >
      {children}
    </div>
  );
}

function StatRow({ stat }: { stat: Stat }) {
  return (
    <Link
      href={stat.href}
      className="group flex items-center justify-between rounded-xl border border-transparent px-3 py-2 hover:bg-[#FAFBFF]"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-xl border p-2" style={{ borderColor: BRAND.border }}>
          {stat.icon}
        </div>
        <div>
          <div className="text-xs text-[#667085]">{stat.label}</div>
          <div className="text-lg font-semibold">{stat.value}</div>
        </div>
      </div>
      <ArrowUpRight className="h-4 w-4 opacity-60 group-hover:opacity-100" />
    </Link>
  );
}

function ActionTile({ a }: { a: QuickAction }) {
  return (
    <Link
      href={a.href}
      className="flex items-center justify-between rounded-2xl border p-4 hover:bg-[#FAFBFF]"
      style={{ borderColor: BRAND.border }}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-xl border p-2" style={{ borderColor: BRAND.border }}>
          {a.icon}
        </div>
        <div>
          <div className="text-sm font-medium">{a.label}</div>
          <div className="text-xs text-[#667085]">{a.sub}</div>
        </div>
      </div>
      <ArrowUpRight className="h-4 w-4 opacity-60" />
    </Link>
  );
}

export default function DashboardPage() {
  // ⚠️ Replace these with real, per-admin queries.
  const owner = {
    name: "Admin",
    plan: "5 Groups (Annual)",
    nextRenewal: "2026-08-15",
    verified: false, // Toggle true when KYC done
    invites: 2, // successful invites
  };

  const stats: Stat[] = [
    {
      label: "WhatsApp/Telegram Groups",
      value: 3,
      href: "/dashboard/groups",
      icon: <Users2 className="h-5 w-5" />,
    },
    {
      label: "Channels",
      value: 1,
      href: "/dashboard/channels",
      icon: <MessageSquareText className="h-5 w-5" />,
    },
    {
      label: "Business Listings",
      value: 2,
      href: "/dashboard/business",
      icon: <Store className="h-5 w-5" />,
    },
    {
      label: "Import & Export",
      value: 1,
      href: "/dashboard/import-export",
      icon: <Globe className="h-5 w-5" />,
    },
    {
      label: "Active Boosts",
      value: 1,
      href: "/dashboard/pricing",
      icon: <Rocket className="h-5 w-5" />,
    },
    {
      label: "Profile Views (7d)",
      value: 428,
      href: "/dashboard/analytics",
      icon: <BarChart2 className="h-5 w-5" />,
    },
  ];

  const actions: QuickAction[] = [
    {
      label: "Create Group",
      sub: "WhatsApp or Telegram group",
      href: "/dashboard/groups/new",
      icon: <Users2 className="h-5 w-5" />,
    },
    {
      label: "Create Channel",
      sub: "WhatsApp or Telegram channel",
      href: "/dashboard/channels/new",
      icon: <MessageSquareText className="h-5 w-5" />,
    },
    {
      label: "Add Business",
      sub: "WhatsApp/Telegram business number",
      href: "/dashboard/business/new",
      icon: <Store className="h-5 w-5" />,
    },
    {
      label: "Add Import/Export",
      sub: "Find buyers & sellers globally",
      href: "/dashboard/import-export/new",
      icon: <Globe className="h-5 w-5" />,
    },
  ];

  // Referral booster logic (as specified)
  // 1 invite  => Basic Booster (1 week)
  // 3 invites => Max Booster (1 week)
  // 5 invites => Max Booster (1 week) [same as 3, but stronger social proof]
  const referralTier =
    owner.invites >= 5 ? "Max Booster (1 week available)" :
    owner.invites >= 3 ? "Max Booster (1 week available)" :
    owner.invites >= 1 ? "Basic Booster (1 week available)" :
    "No rewards yet";

  return (
    <main className="mx-auto max-w-7xl p-6">
      {/* Top: three dots + Dashboard (click returns to /dashboard) */}
      <div className="mb-6">
        <LogoFeature label="Dashboard" href="/dashboard" />
      </div>

      {/* Headline */}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#0E1324]">
            Welcome back, {owner.name}
          </h1>
          <p className="mt-1 text-sm text-[#667085]">
            Manage your groups, channels, business listings, boosts, billing, support, and verification — all in one place.
          </p>
        </div>
        <Link
          href="/dashboard/pricing"
          className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 font-medium"
          style={{ borderColor: BRAND.border }}
        >
          <Rocket className="h-4 w-4" />
          Boost & Pricing
        </Link>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <StatRow stat={s} />
          </Card>
        ))}
      </div>

      {/* Two columns: Quick create + Account status */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick create */}
        <Card className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold">Quick Create</div>
            <Link href="/dashboard/import-export" className="text-xs text-[#667085] hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {actions.map((a) => (
              <ActionTile key={a.label} a={a} />
            ))}
          </div>
        </Card>

        {/* Account status */}
        <Card>
          <div className="mb-4 text-sm font-semibold">Account Status</div>

          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border p-2" style={{ borderColor: BRAND.border }}>
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-[#667085]">Current Plan</div>
                <div className="font-medium">{owner.plan}</div>
              </div>
            </div>
            <Link href="/dashboard/pricing" className="text-sm text-[#0E1324] underline">
              Change
            </Link>
          </div>

          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border p-2" style={{ borderColor: BRAND.border }}>
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-[#667085]">Verification</div>
                <div className="font-medium">
                  {owner.verified ? "Verified" : "Not verified"}
                </div>
              </div>
            </div>
            <Link
              href="/dashboard/verification"
              className="text-sm text-[#0E1324] underline"
            >
              {owner.verified ? "View" : "Start"}
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border p-2" style={{ borderColor: BRAND.border }}>
                <Gift className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-[#667085]">Referrals</div>
                <div className="font-medium">{referralTier}</div>
                <div className="text-xs text-[#667085]">
                  {owner.invites} successful invite{owner.invites === 1 ? "" : "s"}
                </div>
              </div>
            </div>
            <Link href="/dashboard/referrals" className="text-sm text-[#0E1324] underline">
              Promote
            </Link>
          </div>
        </Card>
      </div>

      {/* Lower row: Analytics summary + Billing + Support/Profile/Settings quick links */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold">This Week — At a glance</div>
            <Link href="/dashboard/analytics" className="text-xs text-[#667085] hover:underline">
              View full analytics
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-xl border p-4" style={{ borderColor: BRAND.border }}>
              <div className="text-xs text-[#667085]">Impressions</div>
              <div className="mt-1 text-xl font-semibold">2,184</div>
              <div className="text-xs text-[#22C55E]">+12% vs last week</div>
            </div>
            <div className="rounded-xl border p-4" style={{ borderColor: BRAND.border }}>
              <div className="text-xs text-[#667085]">Clicks</div>
              <div className="mt-1 text-xl font-semibold">713</div>
              <div className="text-xs text-[#22C55E]">+6% vs last week</div>
            </div>
            <div className="rounded-xl border p-4" style={{ borderColor: BRAND.border }}>
              <div className="text-xs text-[#667085]">Joins / Contacts</div>
              <div className="mt-1 text-xl font-semibold">84</div>
              <div className="text-xs text-[#EF4444]">-3% vs last week</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-3 text-sm font-semibold">Billing Snapshot</div>
          <div className="rounded-xl border p-4" style={{ borderColor: BRAND.border }}>
            <div className="text-xs text-[#667085]">Next Renewal</div>
            <div className="mt-1 font-medium">{owner.nextRenewal}</div>
            <div className="mt-3 text-xs text-[#667085]">Recent Payment</div>
            <div className="mt-1 text-sm">
              ₹5,400 • 2025-08-10 • Razorpay
            </div>
            <Link href="/dashboard/billing" className="mt-3 inline-block text-sm underline">
              View billing history
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Link
              href="/dashboard/support"
              className="rounded-xl border p-3 text-center text-sm"
              style={{ borderColor: BRAND.border }}
            >
              <LifeBuoy className="mx-auto mb-1 h-5 w-5" />
              Support
            </Link>
            <Link
              href="/dashboard/profile"
              className="rounded-xl border p-3 text-center text-sm"
              style={{ borderColor: BRAND.border }}
            >
              <UserCircle2 className="mx-auto mb-1 h-5 w-5" />
              Profile
            </Link>
            <Link
              href="/dashboard/settings"
              className="rounded-xl border p-3 text-center text-sm"
              style={{ borderColor: BRAND.border }}
            >
              <Settings className="mx-auto mb-1 h-5 w-5" />
              Settings
            </Link>
          </div>
        </Card>
      </div>

      {/* Footer note */}
      <div className="mt-8 text-center text-xs text-[#98A2B3]">
        Built with ❤️ by NEVILINQ • Follow Refactoring UI principles • Levin: keep spacing, hierarchy, and contrast locked.
      </div>
    </main>
  );
}
