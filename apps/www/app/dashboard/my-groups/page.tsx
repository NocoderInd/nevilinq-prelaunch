// apps/www/app/dashboard/my-groups/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Link2,
  Pencil,
  Rocket,
  Eye,
  Filter,
  BadgeCheck,
  Search,
  Layers,
  Info,
} from "lucide-react";

/* BRAND (LOCKED) */
const BRAND = {
  primary: "#030027",
  accent: "#C16E70",
  surface: "#F2F3D9",
  text: "#0E1324",
  bg: "#F7F8FA",
  border: "#E6E9F1",
} as const;

/* TYPES */
type Platform = "whatsapp" | "telegram" | "business";
type VerifyStatus = "unverified" | "pending" | "verified";
type BoostStatus = "none" | "daily" | "weekly" | "15days" | "30days";

type MyEntity = {
  id: string;
  name: string;
  platform: Platform;
  groupType?: "group" | "channel";
  slug: string;
  description: string;
  hashtags: string[];
  city?: string;
  country?: string;
  verified: VerifyStatus;
  boosted: BoostStatus;
  members: number;
  createdAt: string;
  inviteOrNumber: string;
};

/* MOCK DATA (replace with API later) */
const MOCK_ENTITIES: MyEntity[] = [
  {
    id: "g1",
    name: "Startup Founders India",
    platform: "whatsapp",
    groupType: "group",
    slug: "startup-founders-india",
    description: "Discuss fundraising, GTM, and scalable systems. Curated Indian founders.",
    hashtags: ["#startups", "#india", "#founders"],
    city: "Hyderabad",
    country: "IN",
    verified: "pending",
    boosted: "none",
    members: 243,
    createdAt: "2025-07-22T08:31:00Z",
    inviteOrNumber: "https://chat.whatsapp.com/INVITE_HASH_1",
  },
  {
    id: "g2",
    name: "Algo Trading Hub",
    platform: "telegram",
    groupType: "channel",
    slug: "algo-trading-hub",
    description: "Premium quant insights, backtests, and live signals.",
    hashtags: ["#trading", "#quant", "#signals"],
    city: "Mumbai",
    country: "IN",
    verified: "verified",
    boosted: "weekly",
    members: 4812,
    createdAt: "2025-06-18T12:10:00Z",
    inviteOrNumber: "https://t.me/joinchat/INVITE_HASH_2",
  },
  {
    id: "g3",
    name: "Zencraft Interiors — Business",
    platform: "business",
    slug: "zencraft-interiors",
    description: "Interior design studio. Book consults via WhatsApp Business.",
    hashtags: ["#interiors", "#home", "#design"],
    city: "Hyderabad",
    country: "IN",
    verified: "unverified",
    boosted: "none",
    members: 0,
    createdAt: "2025-08-01T10:02:00Z",
    inviteOrNumber: "+918917444396",
  },
  {
    id: "g4",
    name: "AI/ML India Collective",
    platform: "whatsapp",
    groupType: "group",
    slug: "aiml-india-collective",
    description: "Daily papers, code, jobs. Strict moderation; verified admins.",
    hashtags: ["#ai", "#ml", "#jobs"],
    city: "Bengaluru",
    country: "IN",
    verified: "verified",
    boosted: "none",
    members: 1590,
    createdAt: "2025-05-28T07:15:00Z",
    inviteOrNumber: "https://chat.whatsapp.com/INVITE_HASH_3",
  },
];

/* BUNDLE LICENSE (LOCKED MODEL) */
type BundleSize = 3 | 5 | 12;
type BundleInfo = { size: BundleSize; annualFeeINR: number };
const BUNDLES: Record<string, BundleInfo> = {
  small: { size: 3, annualFeeINR: 3800 },
  medium: { size: 5, annualFeeINR: 5400 },
  large: { size: 12, annualFeeINR: 10800 },
} as const;
const ACTIVE_BUNDLE: BundleInfo = BUNDLES.medium;

/* UTIL */
function cn(...args: Array<string | false | null | undefined>) {
  return args.filter(Boolean).join(" ");
}
function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
  } catch {
    return d;
  }
}

/* BADGES */
function VerifyBadge({ status }: { status: VerifyStatus }) {
  if (status === "verified") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs"
        style={{ background: "#E8F5E9", color: "#146C2E", border: "1px solid #CDE8D2" }}
        title="Verified by NEVILINQ"
      >
        <BadgeCheck size={14} /> Verified
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs"
        style={{ background: "#FFF8E1", color: "#8A5A00", border: "1px solid #F7DE9F" }}
        title="Verification in progress"
      >
        <Info size={14} /> Pending
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs"
      style={{ background: "#FCE8E8", color: "#8A1F1F", border: "1px solid #F3C1C1" }}
      title="Submit ownership proof to verify"
    >
      <AlertTriangle size={14} /> Unverified
    </span>
  );
}

function BoostBadge({ boosted }: { boosted: BoostStatus }) {
  if (boosted === "none") return null;
  const label =
    boosted === "daily"
      ? "Boosted • Daily"
      : boosted === "weekly"
      ? "Boosted • Weekly"
      : boosted === "15days"
      ? "Boosted • 15 Days"
      : "Boosted • 30 Days";
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs"
      style={{ background: "#EEF2FF", color: "#1E2B7A", border: "1px solid #D7DCFF" }}
      title="Currently promoted"
    >
      <Rocket size={14} /> {label}
    </span>
  );
}

/* ROW ACTIONS */
function RowActions({ row }: { row: MyEntity }) {
  const router = useRouter();
  const viewHref = `/entity/${row.slug}`;
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={viewHref}
        className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm"
        style={{ borderColor: BRAND.border }}
        title="View public page"
      >
        <Eye size={16} />
        View
      </Link>

      <button
        type="button"
        onClick={() => router.push(`/dashboard/manage/${row.id}`)}
        className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm"
        style={{ borderColor: BRAND.border }}
        title="Edit details"
      >
        <Pencil size={16} />
        Edit
      </button>

      {row.verified !== "verified" && (
        <button
          type="button"
          onClick={() => router.push(`/dashboard/verify/${row.id}`)}
          className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm"
          style={{ borderColor: BRAND.border }}
          title="Verify ownership (OTP + link proof)"
        >
          <ShieldCheck size={16} />
          Verify
        </button>
      )}

      {/* ADMIN‑ONLY */}
      <button
        type="button"
        onClick={() => router.push(`/dashboard/boost/${row.id}`)}
        className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm"
        style={{
          borderColor: BRAND.border,
          background: "linear-gradient(90deg, indigo, aqua)",
          color: "white",
        }}
        title="Boost visibility (daily/weekly/15/30 days)"
      >
        <Rocket size={16} />
        Boost
      </button>
    </div>
  );
}

/* HEADER */
function HeaderBar({
  onAdd,
  totalUsed,
  bundle,
}: {
  onAdd: () => void;
  totalUsed: number;
  bundle: BundleInfo;
}) {
  const usagePct = Math.min((totalUsed / bundle.size) * 100, 100);

  return (
    <div className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur" style={{ borderColor: BRAND.border }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="inline-flex items-center gap-2" title="Back to landing">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.accent }} />
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.primary }} />
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.accent }} />
          </span>
          <span className="text-sm font-semibold tracking-wide" style={{ color: BRAND.primary, letterSpacing: "0.03em" }}>
            NEVILINQ • My Groups
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 md:flex">
            <Layers size={16} />
            <div className="w-40 rounded-full bg-[#EEF1F7]">
              <div className="h-2 rounded-full" style={{ width: `${usagePct}%`, background: BRAND.primary }} />
            </div>
            <span className="text-sm text-[#495269]">
              {totalUsed}/{bundle.size} used
            </span>
            <span className="text-xs text-[#6B7280]">(₹{bundle.annualFeeINR}/year)</span>
          </div>

          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium shadow-sm"
            style={{ background: BRAND.primary, color: "#fff" }}
            title="Add group/channel/business"
          >
            <Plus size={16} />
            Add New
          </button>
        </div>
      </div>
    </div>
  );
}

/* FILTERS */
function Filters({
  q,
  setQ,
  platform,
  setPlatform,
  verify,
  setVerify,
}: {
  q: string;
  setQ: (v: string) => void;
  platform: Platform | "all";
  setPlatform: (p: Platform | "all") => void;
  verify: VerifyStatus | "all";
  setVerify: (v: VerifyStatus | "all") => void;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3" style={{ borderColor: BRAND.border }}>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5" size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search your entities by name or hashtag…"
            className="w-full rounded-xl border px-9 py-2 text-sm outline-none"
            style={{ borderColor: BRAND.border, background: "#fff", color: BRAND.text }}
          />
        </div>

        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1 rounded-xl border px-2 py-2 text-xs" style={{ borderColor: BRAND.border }}>
            <Filter size={14} /> Filters
          </span>

          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as Platform | "all")}
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
            style={{ borderColor: BRAND.border, background: "#fff" }}
          >
            <option value="all">All platforms</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="telegram">Telegram</option>
            <option value="business">Business</option>
          </select>
        </div>

        <select
          value={verify}
          onChange={(e) => setVerify(e.target.value as VerifyStatus | "all")}
          className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
          style={{ borderColor: BRAND.border, background: "#fff" }}
        >
          <option value="all">All verification states</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>
    </div>
  );
}

/* CARD */
function EntityCard({ row }: { row: MyEntity }) {
  const router = useRouter();
  const topChip =
    row.platform === "business"
      ? "WhatsApp Business"
      : row.platform === "whatsapp"
      ? `WhatsApp ${row.groupType === "channel" ? "Channel" : "Group"}`
      : `Telegram ${row.groupType === "group" ? "Group" : "Channel"}`;

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border p-4" style={{ borderColor: BRAND.border, background: "#fff" }}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span
            className="truncate rounded-full px-2 py-0.5 text-xs font-medium"
            style={{ background: "#FFF7D6", border: "1px solid #F1E1A6", color: "#7A5B00", maxWidth: "70%" }}
            title={topChip}
          >
            {topChip}
          </span>
          <div className="flex items-center gap-2">
            <VerifyBadge status={row.verified} />
            <BoostBadge boosted={row.boosted} />
          </div>
        </div>

        <h3 className="line-clamp-1 text-base font-semibold" style={{ color: BRAND.primary }}>
          {row.name}
        </h3>

        <p className="line-clamp-2 text-sm text-[#495269]">{row.description}</p>

        <div className="flex flex-wrap gap-1">
          {row.hashtags.map((h) => (
            <span
              key={h}
              className="rounded-full px-2 py-0.5 text-[11px]"
              style={{ background: "#F5F7FB", border: `1px solid ${BRAND.border}`, color: "#495269" }}
            >
              {h}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-[#6B7280]">
          <div className="flex items-center gap-3">
            {row.city && <span>{row.city}</span>}
            {row.country && <span>{row.country}</span>}
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} />
            {row.members.toLocaleString()} members
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <Link
          href={`/entity/${row.slug}`}
          className="inline-flex w-full items-center justify-center gap-1 rounded-xl border px-3 py-2 text-sm md:w-auto"
          style={{ borderColor: BRAND.border }}
          title="View public page"
        >
          <Eye size={16} />
          View
        </Link>

        <div className="flex w-full justify-between gap-2 md:w-auto">
          {row.verified !== "verified" && (
            <button
              type="button"
              onClick={() => router.push(`/dashboard/verify/${row.id}`)}
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border px-3 py-2 text-sm md:flex-none"
              style={{ borderColor: BRAND.border }}
              title="Submit ownership proof"
            >
              <ShieldCheck size={16} />
              Verify
            </button>
          )}
          <button
            type="button"
            onClick={() => router.push(`/dashboard/boost/${row.id}`)}
            className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl px-3 py-2 text-sm md:flex-none"
            style={{ background: "linear-gradient(90deg, indigo, aqua)", color: "white", borderRadius: "0.75rem" }}
            title="Boost visibility"
          >
            <Rocket size={16} />
            Boost
          </button>
        </div>
      </div>
    </div>
  );
}

/* PAGE */
export default function MyGroupsPage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [platform, setPlatform] = useState<Platform | "all">("all");
  const [verify, setVerify] = useState<VerifyStatus | "all">("all");

  const data = MOCK_ENTITIES;

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return data.filter((e) => {
      if (platform !== "all" && e.platform !== platform) return false;
      if (verify !== "all" && e.verified !== verify) return false;
      if (!query) return true;
      const hay = `${e.name} ${e.description} ${e.hashtags.join(" ")}`.toLowerCase();
      return hay.includes(query);
    });
  }, [q, platform, verify, data]);

  const usedCount = data.length;
  const usagePct = Math.min((usedCount / ACTIVE_BUNDLE.size) * 100, 100);
  const overCap = usedCount > ACTIVE_BUNDLE.size;

  return (
    <div className="min-h-screen" style={{ background: BRAND.bg, color: BRAND.text }}>
      <HeaderBar onAdd={() => router.push("/dashboard/manage/new")} totalUsed={usedCount} bundle={ACTIVE_BUNDLE} />

      {/* Verification guidance — NO BOTS, NO CO‑ADMIN */}
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div className="flex items-start gap-3 rounded-2xl border p-4" style={{ borderColor: BRAND.border, background: BRAND.surface }}>
          <ShieldCheck size={18} className="mt-0.5" />
          <div className="text-sm">
            <div className="font-semibold">Verification without bots</div>
            <div className="mt-1 text-[#495269]">
              We verify via ownership proofs—no co‑admin required. Complete any two of these:
              <ul className="mt-1 list-disc pl-5">
                <li>OTP to your listed WhatsApp/Telegram number</li>
                <li>Short link‑ownership challenge (add a temp code to your group/about or channel description and share a screenshot)</li>
                <li>Screenshot of group/channel info page showing name & admins</li>
                <li>(Business) Basic KYC: GST/UDYAM or visiting card + website/social link</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Over capacity alert */}
      {overCap && (
        <div className="mx-auto max-w-6xl px-4 pt-3">
          <div className="flex items-start gap-3 rounded-2xl border p-4" style={{ borderColor: BRAND.border, background: "#FFF5F5" }}>
            <AlertTriangle size={18} className="mt-0.5" />
            <div className="text-sm">
              <div className="font-semibold">Bundle limit reached</div>
              <div className="mt-1 text-[#7A1F1F]">
                You’ve added {usedCount} entities but your license includes {ACTIVE_BUNDLE.size}. Upgrade to a bigger bundle to add more.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <Filters q={q} setQ={setQ} platform={platform} setPlatform={setPlatform} verify={verify} setVerify={setVerify} />

      {/* Results header */}
      <div className="mx-auto max-w-6xl px-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="text-sm text-[#495269]">
            Showing <span className="font-semibold">{filtered.length}</span> of{" "}
            <span className="font-semibold">{data.length}</span>
          </div>
          <Link href="/search" className="inline-flex items-center gap-1 text-sm underline" title="Preview marketplace">
            <Link2 size={14} />
            Preview marketplace
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-6xl grid grid-cols-1 gap-4 px-4 pb-10 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((row) => (
          <EntityCard key={row.id} row={row} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-2xl border p-8 text-center" style={{ borderColor: BRAND.border, background: "#fff" }}>
            <div className="mx-auto mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "#EEF1F7" }}>
              <Search size={18} />
            </div>
            <div className="text-sm text-[#495269]">
              No results. Try different filters or{" "}
              <button type="button" className="underline" onClick={() => router.push("/dashboard/manage/new")}>
                add your first entity
              </button>
              .
            </div>
          </div>
        )}
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-8 text-xs text-[#6B7280]">
        Note: “Boost” is visible only to you (admin). Public users never see boost controls.
      </div>
    </div>
  );
}
