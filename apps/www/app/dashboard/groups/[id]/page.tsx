// apps/www/app/groups/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Users2,
  ShieldCheck,
  CheckCircle2,
  Link as LinkIcon,
  Share2,
  Rocket,
  MapPin,
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

/********************
 * Types
 ********************/
type Platform = "whatsapp" | "telegram";
export type PublicGroup = {
  id: string;
  title: string;
  description?: string;
  platform: Platform;
  category?: string;
  city?: string;
  country?: string; // ISO2 like "IN"
  members: number;
  inviteLink: string; // External WA/TG join link
  paid: boolean; // false → free group
  boosted?: boolean;
  verifiedAdmin: boolean; // admin-level verification (group itself is not required)
  createdAt: string; // ISO
  slug?: string; // optional for canonical
};

/********************
 * Data
 ********************/
async function getGroup(id: string): Promise<PublicGroup | null> {
  // Try API first (set NEXT_PUBLIC_APP_URL if needed)
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_URL?.startsWith("http")
      ? process.env.VERCEL_URL
      : undefined;

  try {
    const url = base
      ? `${base}/api/groups/${encodeURIComponent(id)}`
      : `${process.env.NEXT_PUBLIC_APP_ORIGIN ?? ""}/api/groups/${encodeURIComponent(id)}`;

    // If no base is configured, this fetch will likely fail; we catch and fall back to mock.
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      const g = (await res.json()) as PublicGroup | null;
      if (g && g.id) return g;
    }
  } catch {
    // fall through to mock
  }

  // ---- DEV MOCK (remove once API is wired) ----
  const mock: Record<string, PublicGroup> = {
    "g_wh_001": {
      id: "g_wh_001",
      title: "Hyderabad Startup Jobs",
      description:
        "Daily curated startup roles, referral leads, and hiring alerts focused on Hyderabad’s tech ecosystem.",
      platform: "whatsapp",
      category: "Jobs",
      city: "Hyderabad",
      country: "IN",
      members: 742,
      inviteLink: "https://chat.whatsapp.com/XXXXXXX",
      paid: false,
      boosted: true,
      verifiedAdmin: true,
      createdAt: "2025-07-28T09:00:00.000Z",
      slug: "hyderabad-startup-jobs",
    },
    "g_tg_002": {
      id: "g_tg_002",
      title: "Flutter Devs India",
      description:
        "A friendly Telegram community for Flutter developers in India. Share tips, gigs, and app reviews.",
      platform: "telegram",
      category: "Programming",
      city: "Remote",
      country: "IN",
      members: 2389,
      inviteLink: "https://t.me/+YYYYYYY",
      paid: false,
      boosted: false,
      verifiedAdmin: true,
      createdAt: "2025-07-22T13:30:00.000Z",
      slug: "flutter-devs-india",
    },
  };
  return mock[id] ?? null;
}

/********************
 * Metadata / SEO
 ********************/
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const g = await getGroup(params.id);
  if (!g) return { title: "Group not found • NEVILINQ" };

  const title = `${g.title} • ${g.platform === "whatsapp" ? "WhatsApp" : "Telegram"} Group on NEVILINQ`;
  const desc =
    g.description ||
    `Join ${g.title} on ${g.platform === "whatsapp" ? "WhatsApp" : "Telegram"} — a free group listed on NEVILINQ.`;
  const url = `/groups/${encodeURIComponent(g.id)}`;

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: desc,
      url,
      type: "website",
    },
  };
}

function JSONLD({ g }: { g: PublicGroup }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: g.title,
    description: g.description ?? "Free community group listed on NEVILINQ.",
    url: `https://www.nevilinq.com/groups/${encodeURIComponent(g.id)}`,
    sameAs: [g.inviteLink],
    location: g.city
      ? {
          "@type": "Place",
          name: g.city,
          address: { "@type": "PostalAddress", addressCountry: g.country ?? "IN" },
        }
      : undefined,
  };
  return (
    <script
      type="application/ld+json"
      // @ts-expect-error — JSON serialization OK
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/********************
 * Page
 ********************/
export const revalidate = 60;

export default async function GroupDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const g = await getGroup(params.id);
  if (!g) return notFound();

  const isWhatsApp = g.platform === "whatsapp";

  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.bg, color: BRAND.text }}>
      <div className="mx-auto max-w-5xl px-6 pb-16 pt-8">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm opacity-80">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-1.5">/</span>
          <Link href="/groups" className="hover:underline">Groups</Link>
          <span className="mx-1.5">/</span>
          <span className="opacity-90">{g.title}</span>
        </nav>

        {/* Header Card */}
        <div
          className="rounded-3xl border bg-white p-6 shadow-sm"
          style={{ borderColor: BRAND.border }}
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border text-sm font-semibold uppercase"
                  style={{ borderColor: BRAND.border, backgroundColor: BRAND.surface, color: BRAND.primary }}
                  title={isWhatsApp ? "WhatsApp" : "Telegram"}
                >
                  {isWhatsApp ? "WA" : "TG"}
                </div>
                <div className="min-w-0">
                  <h1 className="truncate text-xl font-semibold" style={{ color: BRAND.primary }}>
                    {g.title}
                  </h1>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                    {g.category && (
                      <span className="rounded-full border px-2 py-0.5" style={{ borderColor: BRAND.border }}>
                        {g.category}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Users2 className="h-4 w-4 opacity-70" />
                      {new Intl.NumberFormat(undefined).format(g.members)} members
                    </span>
                    {(g.city || g.country) && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-4 w-4 opacity-70" />
                        {g.city ?? "Worldwide"}
                        {g.city && g.country ? `, ${g.country}` : g.country ? g.country : ""}
                      </span>
                    )}
                    {!g.paid && (
                      <span
                        className="rounded-full border px-2 py-0.5 text-[11px] font-medium"
                        style={{ borderColor: BRAND.border }}
                      >
                        Free group
                      </span>
                    )}
                    {g.boosted && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
                        style={{ backgroundColor: BRAND.surface, color: BRAND.primary }}
                      >
                        <Rocket className="h-3.5 w-3.5" />
                        Boosted
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[12px]">
                      {g.verifiedAdmin ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-green-600" /> Admin verified
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-4 w-4 text-amber-600" /> Admin not verified
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <JoinActions inviteLink={g.inviteLink} platform={g.platform} />
          </div>

          {/* Description */}
          {g.description && (
            <div className="mt-5 text-sm leading-6">
              {g.description}
            </div>
          )}

          {/* Info row */}
          <div className="mt-5 rounded-2xl border p-4 text-xs" style={{ borderColor: BRAND.border }}>
            <p className="opacity-80">
              This is a <b>free group</b>; <u>group verification is not required</u>. NEVILINQ verifies the{" "}
              <b>admin</b> separately to prevent abuse and spam.
            </p>
          </div>
        </div>

        {/* Footer help */}
        <div className="mt-4 text-xs opacity-70">
          Having trouble joining? The invite link is controlled by the group admin and may change.
        </div>
      </div>

      <JSONLD g={g} />
    </div>
  );
}

/********************
 * Client join/share actions
 ********************/
"use client";
import * as React from "react";

function JoinActions({
  inviteLink,
  platform,
}: {
  inviteLink: string;
  platform: Platform;
}) {
  const [copied, setCopied] = React.useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  async function onShare() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Join this group on NEVILINQ",
          text: "Check out this community group on NEVILINQ.",
          url: inviteLink,
        });
      } else {
        await onCopy();
      }
    } catch {
      // ignore
    }
  }

  const ctaText = platform === "whatsapp" ? "Join on WhatsApp" : "Join on Telegram";

  return (
    <div className="flex shrink-0 items-center gap-2">
      <a
        href={inviteLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium shadow-sm transition hover:shadow"
        style={{ background: "linear-gradient(90deg, indigo, aqua)", color: "white" }}
      >
        {ctaText}
      </a>
      <button
        onClick={onCopy}
        className="inline-flex items-center gap-1 rounded-2xl border px-3 py-2 text-sm"
        style={{ borderColor: BRAND.border }}
        title="Copy invite link"
      >
        <LinkIcon className="h-4 w-4" />
        {copied ? "Copied!" : "Copy"}
      </button>
      <button
        onClick={onShare}
        className="inline-flex items-center gap-1 rounded-2xl border px-3 py-2 text-sm"
        style={{ borderColor: BRAND.border }}
        title="Share"
      >
        <Share2 className="h-4 w-4" />
        Share
      </button>
    </div>
  );
}
