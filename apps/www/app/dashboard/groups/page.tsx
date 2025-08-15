// apps/www/app/dashboard/groups/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import {
  Plus,
  Users2,
  Link as LinkIcon,
  Pencil,
  Trash2,
  ExternalLink,
  Rocket,
  CheckCircle2,
  ShieldCheck,
  Search,
  Filter,
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
 * Helpers
 ********************/
function cn(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}
const fmt = new Intl.NumberFormat(undefined);

/********************
 * Types
 ********************/
type Platform = "whatsapp" | "telegram";
type Group = {
  id: string;
  title: string;
  platform: Platform;
  category?: string;
  city?: string;
  country?: string;
  members: number;
  inviteLink: string; // external join or deep link
  paid: boolean; // false for free groups
  boosted?: boolean;
  verifiedAdmin: boolean; // admin-level verification (separate from group verification)
  createdAt: string; // ISO
  status: "active" | "draft" | "paused";
};

/********************
 * Page
 ********************/
export default function GroupsPage() {
  // In production, replace with real fetch:
  // useEffect(() => { fetch("/api/me/groups").then(r=>r.json()).then(setGroups) }, [])
  const [groups, setGroups] = React.useState<Group[] | null>(null);
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | "active" | "draft" | "paused">("all");
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // Simulated admin verification (read from profile later)
  const [adminVerified, setAdminVerified] = React.useState<boolean>(true);

  React.useEffect(() => {
    // DEV seed — remove after wiring API
    const seed: Group[] = [
      {
        id: "g_wh_001",
        title: "Hyderabad Startup Jobs",
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
        status: "active",
      },
      {
        id: "g_tg_002",
        title: "Flutter Devs India",
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
        status: "active",
      },
      {
        id: "g_wh_003",
        title: "Bakers of Bangalore",
        platform: "whatsapp",
        category: "Food",
        city: "Bengaluru",
        country: "IN",
        members: 156,
        inviteLink: "https://chat.whatsapp.com/ZZZZZZZ",
        paid: false,
        boosted: false,
        verifiedAdmin: false,
        createdAt: "2025-08-01T10:20:00.000Z",
        status: "draft",
      },
    ];
    setGroups(seed);
  }, []);

  const filtered = React.useMemo(() => {
    const list = groups ?? [];
    const q = query.trim().toLowerCase();
    return list.filter((g) => {
      const matchesFilter = filter === "all" ? true : g.status === filter;
      const matchesQuery =
        q.length === 0 ||
        [g.title, g.category, g.city, g.country, g.platform].filter(Boolean).some((v) =>
          String(v).toLowerCase().includes(q)
        );
      return matchesFilter && matchesQuery;
    });
  }, [groups, query, filter]);

  async function onCopy(link: string, id: string) {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(id);
      setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 1500);
    } catch {
      // noop
    }
  }

  function onDelete(id: string) {
    // Replace with API call, then update state
    setGroups((prev) => (prev ?? []).filter((g) => g.id !== id));
  }

  function onTogglePause(id: string) {
    setGroups((prev) =>
      (prev ?? []).map((g) => (g.id === id ? { ...g, status: g.status === "paused" ? "active" : "paused" } : g))
    );
  }

  return (
    <div className="px-6 pb-12">
      {/* Top bar */}
      <div className="sticky top-0 z-10 -mx-6 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60"
           style={{ borderColor: BRAND.border }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: BRAND.primary }}>My Groups</h1>
            <p className="text-sm opacity-80" style={{ color: BRAND.text }}>
              Free groups don’t require group verification. We verify <span className="font-medium">you</span> (the admin) separately.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/groups/new"
              className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium shadow-sm transition hover:shadow"
              style={{ background: "linear-gradient(90deg, indigo, aqua)", color: "white" }}
            >
              <Plus className="h-4 w-4" />
              Create Group
            </Link>
          </div>
        </div>
      </div>

      {/* Admin verification callout */}
      <div
        className={cn(
          "mx-auto mt-4 max-w-6xl rounded-2xl border p-4",
          adminVerified ? "bg-green-50" : "bg-amber-50"
        )}
        style={{ borderColor: BRAND.border }}
      >
        <div className="flex items-start gap-3">
          {adminVerified ? (
            <ShieldCheck className="mt-0.5 h-5 w-5 text-green-600" />
          ) : (
            <ShieldCheck className="mt-0.5 h-5 w-5 text-amber-600" />
          )}
          <div className="flex-1 text-sm" style={{ color: BRAND.text }}>
            <p className="font-medium">
              {adminVerified ? "Admin Verified" : "Admin Not Verified"}
            </p>
            <p className="opacity-80">
              {adminVerified
                ? "You’re verified. You can add and manage free groups instantly."
                : (
                  <>
                    You don’t need group verification for free groups, but we still verify admins.{" "}
                    <Link href="/dashboard/verification" className="underline decoration-dotted underline-offset-4">
                      Verify now
                    </Link>.
                  </>
                )}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mx-auto mt-6 flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          {(["all", "active", "draft", "paused"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm capitalize transition",
                filter === k ? "shadow-sm" : "opacity-75 hover:opacity-100"
              )}
              style={{
                borderColor: BRAND.border,
                backgroundColor: filter === k ? BRAND.surface : "white",
                color: BRAND.text,
              }}
            >
              {k}
            </button>
          ))}
        </div>

        <div className="flex w-full items-center gap-2 md:w-80">
          <div className="relative w-full">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your groups…"
              className="w-full rounded-2xl border px-10 py-2 text-sm outline-none"
              style={{ borderColor: BRAND.border, color: BRAND.text, backgroundColor: "white" }}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 opacity-70" />
          </div>
          <button
            className="inline-flex items-center gap-1 rounded-2xl border px-3 py-2 text-sm"
            style={{ borderColor: BRAND.border, color: BRAND.text, backgroundColor: "white" }}
          >
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      {/* List */}
      <div className="mx-auto mt-4 max-w-6xl overflow-hidden rounded-2xl border bg-white" style={{ borderColor: BRAND.border }}>
        {/* Header row */}
        <div className="grid grid-cols-12 items-center gap-4 border-b px-5 py-3 text-xs font-medium uppercase tracking-wide"
             style={{ borderColor: BRAND.border, color: BRAND.text }}>
          <div className="col-span-4">Group</div>
          <div className="col-span-2">Members</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-4 text-right">Actions</div>
        </div>

        {/* Rows */}
        {!groups ? (
          <div className="px-5 py-12 text-center text-sm" style={{ color: BRAND.text }}>
            Loading your groups…
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm" style={{ color: BRAND.text }}>
            No groups found. Create your first one!
            <div className="mt-3">
              <Link
                href="/dashboard/groups/new"
                className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium shadow-sm transition hover:shadow"
                style={{ background: "linear-gradient(90deg, indigo, aqua)", color: "white" }}
              >
                <Plus className="h-4 w-4" />
                Create Group
              </Link>
            </div>
          </div>
        ) : (
          filtered.map((g) => (
            <div
              key={g.id}
              className="grid grid-cols-12 items-center gap-4 border-t px-5 py-4"
              style={{ borderColor: BRAND.border }}
            >
              {/* Group */}
              <div className="col-span-4">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "mt-0.5 h-9 w-9 shrink-0 rounded-xl border flex items-center justify-center text-xs font-semibold uppercase",
                    )}
                    style={{ borderColor: BRAND.border, color: BRAND.primary, backgroundColor: BRAND.surface }}
                    title={g.platform === "whatsapp" ? "WhatsApp" : "Telegram"}
                  >
                    {g.platform === "whatsapp" ? "WA" : "TG"}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/groups/${g.id}/edit`} className="truncate font-medium hover:underline">
                        {g.title}
                      </Link>
                      {g.boosted && (
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
                              style={{ backgroundColor: BRAND.surface, color: BRAND.primary }}>
                          <Rocket className="h-3 w-3" />
                          Boosted
                        </span>
                      )}
                      {!g.paid && (
                        <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium"
                              style={{ borderColor: BRAND.border, color: BRAND.text }}>
                          Free group
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs opacity-80" style={{ color: BRAND.text }}>
                      {g.category && <span>{g.category}</span>}
                      {(g.city || g.country) && <span>• {g.city ?? ""}{g.city && g.country ? ", " : ""}{g.country ?? ""}</span>}
                      <span>• Created {new Date(g.createdAt).toLocaleDateString()}</span>
                      <span className="inline-flex items-center gap-1">
                        {g.verifiedAdmin ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> Admin verified
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="h-3.5 w-3.5 text-amber-600" /> Admin not verified
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Members */}
              <div className="col-span-2 text-sm" style={{ color: BRAND.text }}>
                <div className="inline-flex items-center gap-1.5">
                  <Users2 className="h-4 w-4 opacity-70" />
                  {fmt.format(g.members)}
                </div>
              </div>

              {/* Status */}
              <div className="col-span-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium",
                    g.status === "active" && "bg-green-50",
                    g.status === "paused" && "bg-amber-50",
                    g.status === "draft" && "bg-slate-100"
                  )}
                  style={{ color: BRAND.text }}
                >
                  {g.status}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-4">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/groups/${encodeURIComponent(slugify(g.title))}?id=${g.id}`}
                    className="inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-sm"
                    style={{ borderColor: BRAND.border, color: BRAND.text }}
                    title="View public landing"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View
                  </Link>

                  {/* Copy invite link */}
                  <button
                    onClick={() => onCopy(g.inviteLink, g.id)}
                    className="inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-sm"
                    style={{ borderColor: BRAND.border, color: BRAND.text }}
                    title="Copy invite link"
                  >
                    <LinkIcon className="h-4 w-4" />
                    {copiedId === g.id ? "Copied!" : "Invite"}
                  </button>

                  {/* Boost — visible to admin */}
                  <Link
                    href={`/dashboard/groups/${g.id}/boost`}
                    className="inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-sm font-medium shadow-sm transition hover:shadow"
                    style={{ background: "linear-gradient(90deg, indigo, aqua)", color: "white" }}
                    title="Boost group"
                  >
                    <Rocket className="h-4 w-4" />
                    Boost
                  </Link>

                  {/* Pause/Resume */}
                  <button
                    onClick={() => onTogglePause(g.id)}
                    className="inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-sm"
                    style={{ borderColor: BRAND.border, color: BRAND.text }}
                    title={g.status === "paused" ? "Resume group" : "Pause group"}
                  >
                    {g.status === "paused" ? "Resume" : "Pause"}
                  </button>

                  {/* Edit */}
                  <Link
                    href={`/dashboard/groups/${g.id}/edit`}
                    className="inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-sm"
                    style={{ borderColor: BRAND.border, color: BRAND.text }}
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Link>

                  {/* Delete */}
                  <button
                    onClick={() => onDelete(g.id)}
                    className="inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-sm text-red-600"
                    style={{ borderColor: BRAND.border, backgroundColor: "white" }}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer note */}
      <div className="mx-auto mt-4 max-w-6xl text-xs opacity-70" style={{ color: BRAND.text }}>
        Note: Free groups are listed without group-level verification. Admin verification ensures trust & abuse prevention.
      </div>
    </div>
  );
}

/********************
 * Local utils — replace if shared
 ********************/
function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
