"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Search as SearchIcon, Calendar, Clock, Tag as TagIcon, ChevronRight } from "lucide-react";

/** BRAND (LOCKED) */
const BRAND = {
  primary: "#030027",
  accent: "#C16E70",
  surface: "#F2F3D9",
  text: "#0E1324",
  bg: "#F7F8FA",
  border: "#E6E9F1",
} as const;

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  readMinutes: number;
  category: string;
  tags: string[];
  author?: string;
};

const POSTS: Post[] = [
  {
    slug: "introducing-nevilinq",
    title: "Introducing NEVILINQ: The Paid Groups Platform",
    excerpt:
      "Why discovery, verification, and simple monetization will define the next era of WhatsApp & Telegram communities.",
    date: "2025-08-12",
    readMinutes: 5,
    category: "Product",
    tags: ["WhatsApp", "Telegram", "Marketplace", "SEO"],
    author: "NEVILINQ Team",
  },
  {
    slug: "pricing-bundles-explained",
    title: "Platform Fee Bundles Explained (3, 5, 12 Groups)",
    excerpt:
      "We use India as the base, adjust by purchasing power per country, and keep things predictable for admins.",
    date: "2025-08-11",
    readMinutes: 6,
    category: "Finance",
    tags: ["Pricing", "Bundles", "Country-wise"],
    author: "Finn",
  },
  {
    slug: "verified-badges-and-trust",
    title: "Verified Badges & Trust: How We Keep Listings Clean",
    excerpt:
      "A look at our verification signals, reporting flows, and why trust is a growth engine — not just a badge.",
    date: "2025-08-10",
    readMinutes: 4,
    category: "Trust & Safety",
    tags: ["Verification", "Moderation", "UX"],
    author: "Zeal",
  },
  {
    slug: "refactoring-ui-in-practice",
    title: "Refactoring UI in Practice: Designing NEVILINQ",
    excerpt:
      "Levin walks through spacing, contrast, and hierarchy choices that make the interface feel premium.",
    date: "2025-08-09",
    readMinutes: 7,
    category: "Design",
    tags: ["UI/UX", "Refactoring UI", "Design System"],
    author: "Levin",
  },
  {
    slug: "marketplace-seo-playbook",
    title: "Our Marketplace SEO Playbook",
    excerpt:
      "From hashtag search to city pages, how we structure content so groups and business numbers rank everywhere.",
    date: "2025-08-08",
    readMinutes: 8,
    category: "Growth",
    tags: ["SEO", "Hashtags", "Content"],
    author: "Jack",
  },
  {
    slug: "digital-products-blueprint",
    title: "Selling Digital Products via NEVILINQ",
    excerpt:
      "eBooks, templates, and mini-courses — all delivered cleanly with fraud prevention and verified sellers.",
    date: "2025-08-07",
    readMinutes: 6,
    category: "Product",
    tags: ["Digital Products", "Commerce", "Verification"],
    author: "Mike",
  },
  {
    slug: "country-detection-pricing",
    title: "Country Detection & Local Pricing",
    excerpt:
      "Auto-detect country, show local currency, keep fees fair — and avoid confusing price jumps.",
    date: "2025-08-06",
    readMinutes: 5,
    category: "Engineering",
    tags: ["Localisation", "Pricing", "DX"],
    author: "Jash",
  },
  {
    slug: "boosting-strategy",
    title: "Boosting Strategy: Daily, Weekly, 15 & 30 Days",
    excerpt:
      "When to boost, how much, and the ranking signals that matter for visibility on search pages.",
    date: "2025-08-05",
    readMinutes: 4,
    category: "Growth",
    tags: ["Boosting", "Discovery", "Rank"],
    author: "Jack",
  },
  {
    slug: "bot-rotation-concepts",
    title: "Bot Rotation: Concepts for Scale (Future)",
    excerpt:
      "Architecture thoughts for safe rotation when we enable verification bots at massive scale.",
    date: "2025-08-04",
    readMinutes: 7,
    category: "Engineering",
    tags: ["Architecture", "Scale"],
    author: "Sam",
  },
  {
    slug: "genz-onboarding",
    title: "Onboarding GenZ Admins with Zero Friction",
    excerpt:
      "Fast signup, clear pricing, instant listing — reduce cognitive load and celebrate progress early.",
    date: "2025-08-03",
    readMinutes: 3,
    category: "Design",
    tags: ["Onboarding", "GenZ", "UX"],
    author: "Levin",
  },
  {
    slug: "mcp-social-engine",
    title: "Social MCP: Auto Content Engine for X & LinkedIn",
    excerpt:
      "Ship daily narratives without burn — our playbook for consistency, variety, and distribution.",
    date: "2025-08-02",
    readMinutes: 5,
    category: "Growth",
    tags: ["Automation", "Social MCP"],
    author: "Zeal",
  },
  {
    slug: "whatsapp-business-listings",
    title: "WhatsApp Business Number Listings — The Why",
    excerpt:
      "Instant contact, category pages, and SEO-backed discovery — a new surface to connect buyers & sellers.",
    date: "2025-08-01",
    readMinutes: 6,
    category: "Product",
    tags: ["Business Listings", "WhatsApp", "SEO"],
    author: "Mike",
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(POSTS.map((p) => p.category)))];

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

/* Mini logo component — three dots + wordmark (matches landing) */
function LogoMark() {
  return (
    <Link href="/" className="inline-flex items-center hover:opacity-90 transition">
      <span className="mr-2 inline-flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.accent }} />
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.primary }} />
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.accent }} />
      </span>
      <span className="font-semibold tracking-wide" style={{ color: BRAND.primary }}>NEVILINQ</span>
    </Link>
  );
}

function TagChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-full text-xs border transition ${
        active ? "bg-white shadow" : "bg-transparent"
      }`}
      style={{ borderColor: BRAND.border, color: BRAND.text }}
    >
      #{label}
    </button>
  );
}

export default function BlogPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sort, setSort] = useState<"latest" | "oldest">("latest");

  const allTags = useMemo(() => {
    const t = new Set<string>();
    POSTS.forEach((p) => p.tags.forEach((x) => t.add(x)));
    return Array.from(t).slice(0, 10); // top tags to display
  }, []);

  const filtered = useMemo(() => {
    const base = POSTS.filter((p) => {
      const matchesQ =
        !q ||
        p.title.toLowerCase().includes(q.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(q.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(q.toLowerCase()));
      const matchesCat = category === "All" || p.category === category;
      const matchesTag = !activeTag || p.tags.includes(activeTag);
      return matchesQ && matchesCat && matchesTag;
    });
    const sorted = [...base].sort((a, b) =>
      sort === "latest"
        ? +new Date(b.date) - +new Date(a.date)
        : +new Date(a.date) - +new Date(b.date)
    );
    return sorted;
  }, [q, category, activeTag, sort]);

  return (
    <div style={{ backgroundColor: BRAND.bg, color: BRAND.text, minHeight: "100vh" }}>
      {/* Sticky header */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur supports-[backdrop-filter]:bg-white/70"
        style={{ borderColor: BRAND.border, backgroundColor: "rgba(255,255,255,0.75)" }}
      >
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <LogoMark />
          <div className="hidden md:flex items-center gap-3">
            <div className="relative w-80">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search articles…"
                className="w-full pl-10 pr-3 py-2 rounded-full border text-sm outline-none"
                style={{ borderColor: BRAND.border, backgroundColor: "#fff", color: BRAND.text }}
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-full border px-3 py-2 text-sm"
              style={{ borderColor: BRAND.border, backgroundColor: "#fff" }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "latest" | "oldest")}
              className="rounded-full border px-3 py-2 text-sm"
              style={{ borderColor: BRAND.border, backgroundColor: "#fff" }}
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Mobile search controls */}
        <div className="md:hidden mb-6 space-y-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search articles…"
              className="w-full pl-10 pr-3 py-2 rounded-full border text-sm outline-none"
              style={{ borderColor: BRAND.border, backgroundColor: "#fff", color: BRAND.text }}
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 rounded-full border px-3 py-2 text-sm"
              style={{ borderColor: BRAND.border, backgroundColor: "#fff" }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "latest" | "oldest")}
              className="rounded-full border px-3 py-2 text-sm"
              style={{ borderColor: BRAND.border, backgroundColor: "#fff" }}
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        {/* Top bar: title + count + tags */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold" style={{ color: BRAND.primary }}>
              NEVILINQ Blog
            </h1>
            <p className="text-sm opacity-80">
              Stories on product, engineering, design, and growth.
            </p>
          </div>
          <div className="text-sm opacity-80">{filtered.length} articles</div>
        </div>

        {/* Popular tags */}
        <div className="mb-8 flex flex-wrap gap-8">
          <div className="flex items-center gap-2">
            <TagIcon className="h-4 w-4 opacity-70" />
            <span className="text-sm font-medium">Popular tags</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((t) => (
              <TagChip
                key={t}
                label={t}
                active={activeTag === t}
                onClick={() => setActiveTag((prev) => (prev === t ? null : t))}
              />
            ))}
            {activeTag && (
              <button
                onClick={() => setActiveTag(null)}
                className="text-xs underline opacity-80"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <article
              key={p.slug}
              className="group rounded-2xl border bg-white shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
              style={{ borderColor: BRAND.border }}
            >
              {/* Banner stripe */}
              <div
                className="h-1 w-full"
                style={{ backgroundColor: BRAND.accent }}
                aria-hidden
              />

              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-2 inline-flex items-center gap-2 text-xs">
                  <span
                    className="px-2 py-0.5 rounded-full border"
                    style={{
                      borderColor: BRAND.border,
                      backgroundColor: BRAND.surface,
                      color: BRAND.primary,
                    }}
                  >
                    {p.category}
                  </span>
                  <span className="inline-flex items-center gap-1 opacity-80">
                    <Calendar className="h-3.5 w-3.5" /> {formatDate(p.date)}
                  </span>
                  <span className="inline-flex items-center gap-1 opacity-80">
                    <Clock className="h-3.5 w-3.5" /> {p.readMinutes} min read
                  </span>
                </div>

                <h2 className="text-lg font-semibold leading-snug mb-2 group-hover:underline">
                  <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                </h2>

                <p className="text-sm opacity-90 mb-4 line-clamp-3">{p.excerpt}</p>

                <div className="mb-4 flex flex-wrap gap-1.5">
                  {p.tags.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-full text-xs border"
                      style={{ borderColor: BRAND.border }}
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <div className="text-xs opacity-70">{p.author ?? "NEVILINQ Team"}</div>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium"
                    style={{ backgroundColor: BRAND.accent, color: "#fff" }}
                  >
                    Read
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div
            className="mt-16 rounded-2xl border p-10 text-center"
            style={{ borderColor: BRAND.border, backgroundColor: "#fff" }}
          >
            <p className="text-lg font-medium" style={{ color: BRAND.primary }}>
              No articles found
            </p>
            <p className="text-sm opacity-80">
              Try a different search term, category, or clear the tag filter.
            </p>
          </div>
        )}
      </main>

      <footer className="mt-12 border-t" style={{ borderColor: BRAND.border }}>
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm opacity-80">
          © {new Date().getFullYear()} NEVILINQ • Privacy • Terms • Refund
        </div>
      </footer>
    </div>
  );
}
