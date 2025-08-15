// apps/www/app/dashboard/layout.tsx
"use client";

import Link from "next/link";
import React, { useMemo, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
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
  LogOut,
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

/* Mini three-dots logo */
function LogoDots() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.accent }} />
      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.primary }} />
      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.accent }} />
    </span>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const currentLabel = useMemo(() => {
    const map: Array<{ startsWith: string; label: string }> = [
      { startsWith: "/dashboard/verification", label: "Verification" },
      { startsWith: "/dashboard/import-export", label: "Import & Export" },
      { startsWith: "/dashboard/business", label: "Business" },
      { startsWith: "/dashboard/channels", label: "Channels" },
      { startsWith: "/dashboard/groups", label: "Groups" },
      { startsWith: "/dashboard/pricing", label: "Pricing & Boosts" },
      { startsWith: "/dashboard/analytics", label: "Analytics" },
      { startsWith: "/dashboard/referrals", label: "Referrals" },
      { startsWith: "/dashboard/billing", label: "Billing" },
      { startsWith: "/dashboard/support", label: "Support" },
      { startsWith: "/dashboard/profile", label: "Profile" },
      { startsWith: "/dashboard/settings", label: "Settings" },
      { startsWith: "/dashboard", label: "Dashboard" },
    ];
    const match = map.find((m) => pathname.startsWith(m.startsWith));
    return match?.label ?? "Dashboard";
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#0E1324]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[264px,1fr]">
        {/* Sidebar */}
        <aside className="hidden md:block border-r bg-white" style={{ borderColor: BRAND.border }}>
          <div className="sticky top-0 flex h-screen flex-col">
            {/* Brand / Home */}
            <div className="flex items-center gap-2 border-b p-4" style={{ borderColor: BRAND.border }}>
              <LogoDots />
              <Link href="/dashboard" className="text-sm font-semibold hover:opacity-90">
                Dashboard
              </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto p-3">
              <NavSection title="Manage">
                <NavItem href="/dashboard" icon={<LayoutGrid className="h-4 w-4" />} label="Overview" />
                <NavItem href="/dashboard/groups" icon={<Users2 className="h-4 w-4" />} label="Groups" />
                <NavItem href="/dashboard/channels" icon={<MessageSquareText className="h-4 w-4" />} label="Channels" />
                <NavItem href="/dashboard/business" icon={<Store className="h-4 w-4" />} label="Business Listings" />
                <NavItem href="/dashboard/import-export" icon={<Globe className="h-4 w-4" />} label="Import & Export" />
              </NavSection>

              <NavSection title="Growth">
                <NavItem href="/dashboard/pricing" icon={<Rocket className="h-4 w-4" />} label="Pricing & Boosts" />
                <NavItem href="/dashboard/analytics" icon={<BarChart2 className="h-4 w-4" />} label="Analytics" />
                <NavItem href="/dashboard/referrals" icon={<Gift className="h-4 w-4" />} label="Referrals" />
              </NavSection>

              <NavSection title="Account">
                <NavItem href="/dashboard/billing" icon={<Wallet className="h-4 w-4" />} label="Billing" />
                <NavItem href="/dashboard/support" icon={<LifeBuoy className="h-4 w-4" />} label="Support" />
                <NavItem href="/dashboard/verification" icon={<ShieldCheck className="h-4 w-4" />} label="Verification" />
                <NavItem href="/dashboard/profile" icon={<UserCircle2 className="h-4 w-4" />} label="Profile" />
                <NavItem href="/dashboard/settings" icon={<Settings className="h-4 w-4" />} label="Settings" />
              </NavSection>
            </nav>

            {/* Footer actions */}
            <div className="border-t p-3" style={{ borderColor: BRAND.border }}>
              <Link
                href="/logout"
                className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-[#FAFBFF]"
                style={{ borderColor: BRAND.border }}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Link>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <section className="min-h-screen">
          {/* Top bar (mobile) */}
          <TopBarMobile />

          {/* Dynamic page label (three dots + section); clicking goes to /dashboard */}
          <div className="hidden items-center gap-2 border-b bg-white p-4 md:flex" style={{ borderColor: BRAND.border }}>
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-90">
              <LogoDots />
              <span className="tracking-tight">{currentLabel}</span>
            </Link>
          </div>

          {/* Page content */}
          <div className="p-4 md:p-6">{children}</div>
        </section>
      </div>
    </div>
  );
}

function TopBarMobile() {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-3 md:hidden" style={{ borderColor: BRAND.border }}>
      <Link href="/dashboard" className="inline-flex items-center gap-2">
        <LogoDots />
        <span className="text-sm font-semibold">Dashboard</span>
      </Link>
      <Link
        href="/dashboard/pricing"
        className="rounded-xl border px-3 py-1.5 text-sm"
        style={{ borderColor: BRAND.border }}
      >
        Boosts
      </Link>
    </div>
  );
}

function NavSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-4">
      <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-[#98A2B3]">
        {title}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
        active ? "bg-[#F7F8FA] font-medium" : "hover:bg-[#FAFBFF]"
      }`}
      style={{ borderColor: BRAND.border }}
    >
      <span className="rounded-lg border p-1" style={{ borderColor: BRAND.border }}>
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}
