"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search as SearchIcon, ChevronDown, CheckCircle2, Rocket } from "lucide-react";
import GroupCard, { GroupCardData, GroupType } from "../components/entity/GroupCard";

/* Mini logo component: three dots + wordmark (matches landing) */
function LogoMark() {
  return (
    <div className="inline-flex items-center">
      <span className="mr-2 inline-flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#C16E70" }} />
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#030027" }} />
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#C16E70" }} />
      </span>
      <span className="text-xl font-extrabold tracking-wide" style={{ color: "#030027" }}>
        NEVILINQ
      </span>
    </div>
  );
}

/** Extend just the key used for the tab filter (no changes to GroupCard types) */
type ExtraCategoryKey = "import_export";
type CategoryKey = "all" | GroupType | ExtraCategoryKey;

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "whatsapp_group", label: "WhatsApp Groups" },
  { key: "whatsapp_channel", label: "WhatsApp Channels" },
  { key: "telegram_group", label: "Telegram Groups" },
  { key: "telegram_channel", label: "Telegram Channels" },
  { key: "whatsapp_business", label: "Business" },
  { key: "import_export", label: "Import & Export" }, // ✅ new
];

type Filters = { verified: boolean; boosted: boolean };

/* ----- 12 mock cards + 2 I/E cards for testing ----- */
const mockData: GroupCardData[] = [
  {
    id: "1",
    title: "Hyderabad Startups",
    type: "whatsapp_group",
    city: "Hyderabad",
    category: "Startups",
    members: 1842,
    verified: true,
    boosted: true,
    hashtags: ["hyderabad", "startups", "jobs"],
    href: "/groups/hyderabad-startups",
    description: "Daily discussions on fundraising, hiring, GTM, and local founder meetups.",
  },
  {
    id: "2",
    title: "Tech News India",
    type: "telegram_channel",
    category: "Tech",
    members: 52100,
    verified: true,
    boosted: false,
    hashtags: ["technology", "news", "india"],
    href: "/channels/tech-news-india",
    description: "Curated Indian tech headlines, launches, and policy updates in one stream.",
  },
  {
    id: "3",
    title: "UI/UX Designers",
    type: "whatsapp_group",
    city: "Bengaluru",
    category: "Design",
    members: 992,
    verified: false,
    boosted: true,
    hashtags: ["design", "figma", "jobs"],
    href: "/groups/uiux-designers",
    description: "Portfolio feedback, Figma tips, and design job drops for Indian designers.",
  },
  {
    id: "4",
    title: "Arun Digital Marketing",
    type: "whatsapp_business",
    city: "Chennai",
    category: "Marketing",
    verified: true,
    boosted: false,
    hashtags: ["services", "seo", "ads"],
    href: "/business/arun-digital",
    description: "Performance marketing for SMEs: SEO, ads, and landing page builds.",
  },
  {
    id: "5",
    title: "Mumbai Founders Circle",
    type: "whatsapp_group",
    city: "Mumbai",
    category: "Startups",
    members: 2360,
    verified: false,
    boosted: true,
    hashtags: ["mumbai", "founders", "pitch", "hiring"],
    href: "/groups/mumbai-founders",
    description: "Founder-only chat for Mumbai’s startup scene: intros, pitch review, hiring.",
  },
  {
    id: "6",
    title: "Stock Market Learners",
    type: "telegram_group",
    category: "Finance",
    city: "India",
    members: 8800,
    verified: true,
    boosted: true,
    hashtags: ["stocks", "nifty", "learning", "sensex"],
    href: "/groups/stock-market-learners",
    description: "Friendly place to learn charts, indicators, and risk management together.",
  },
  {
    id: "7",
    title: "Pune Coders",
    type: "whatsapp_group",
    city: "Pune",
    category: "Tech",
    members: 1524,
    verified: false,
    boosted: false,
    hashtags: ["pune", "coding", "meetups", "jobs"],
    href: "/groups/pune-coders",
    description: "Weekly meetups, code reviews, and job drops for Pune developers.",
  },
  {
    id: "8",
    title: "Chennai Foodies",
    type: "telegram_channel",
    category: "Food",
    city: "Chennai",
    members: 32000,
    verified: false,
    boosted: true,
    hashtags: ["chennai", "food", "restaurants", "deals"],
    href: "/channels/chennai-foodies",
    description: "Daily picks of new eateries, reviews, and hidden gems around Chennai.",
  },
  {
    id: "9",
    title: "Cricket Buzz • WhatsApp Channel",
    type: "whatsapp_channel",
    category: "Sports",
    city: "India",
    members: 42000,
    verified: true,
    boosted: false,
    hashtags: ["cricket", "ipl", "scores"],
    href: "/channels/cricket-buzz",
    description: "Fast match updates, squads, and highlights for cricket fans.",
  },
  {
    id: "10",
    title: "Ahmedabad Real Estate",
    type: "whatsapp_business",
    city: "Ahmedabad",
    category: "Real Estate",
    verified: false,
    boosted: true,
    hashtags: ["property", "rent", "sale", "ahmedabad"],
    href: "/business/ahmedabad-real-estate",
    description: "Residential & commercial listings with verified owners and agents.",
  },
  {
    id: "11",
    title: "Jaipur Travel Deals",
    type: "telegram_group",
    city: "Jaipur",
    category: "Travel",
    members: 5640,
    verified: false,
    boosted: false,
    hashtags: ["travel", "deals", "jaipur", "weekend"],
    href: "/groups/jaipur-travel-deals",
    description: "Best weekend getaways, local experiences, and hotel discounts.",
  },
  {
    id: "12",
    title: "Remote React Jobs",
    type: "whatsapp_group",
    city: "Remote",
    category: "Jobs",
    members: 2750,
    verified: true,
    boosted: false,
    hashtags: ["react", "remote", "jobs", "frontend"],
    href: "/groups/remote-react-jobs",
    description: "Daily curated remote React roles with referral-friendly companies.",
  },

  /* ---- Import & Export demo cards (use existing GroupCard fields only) ---- */
  {
    id: "IE-1",
    title: "Buyer — Sesame Seeds (UAE)",
    type: "whatsapp_business", // uses existing card style; filtering is by category below
    city: "Dubai",
    category: "Import & Export",
    verified: true,
    boosted: true,
    hashtags: ["import", "export", "buyer", "sesame", "oilseeds"],
    href: "/import-export/buyer-sesame-dubai",
    description: "Long-term requirement. CIF Jebel Ali. Specs: FFA ≤ 2%, Moisture ≤ 6%.",
  },
  {
    id: "IE-2",
    title: "Seller — Basmati Rice 1121 (India)",
    type: "whatsapp_business",
    city: "Karnal",
    category: "Import & Export",
    verified: true,
    boosted: false,
    hashtags: ["import", "export", "seller", "rice", "1121"],
    href: "/import-export/seller-basmati-1121-karnal",
    description: "Monthly supply 200 MT. FOB Mundra / CIF Jebel Ali. Moisture ≤ 12.5%.",
  },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<CategoryKey>("all"); // widened to include 'import_export'
  const [filters, setFilters] = useState<Filters>({ verified: false, boosted: false });
  const [openFilters, setOpenFilters] = useState(false);

  // Track explicit "search" action to show the results count
  const [submitted, setSubmitted] = useState(false);

  // Filter logic with #hashtag support + Import & Export category (by category text)
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const isHash = q.startsWith("#");
    const qClean = isHash ? q.slice(1) : q;

    return mockData.filter((g) => {
      const inCat =
        active === "all"
          ? true
          : active === "import_export"
          ? (g.category || "").toLowerCase().includes("import") ||
            (g.category || "").toLowerCase().includes("export")
          : g.type === active;

      const inQuery =
        !qClean ||
        (!isHash &&
          (g.title.toLowerCase().includes(qClean) ||
            (g.city || "").toLowerCase().includes(qClean) ||
            (g.category || "").toLowerCase().includes(qClean))) ||
        (g.hashtags ?? []).some((h: string) => h.toLowerCase().includes(qClean));

      const okVerified = filters.verified ? !!g.verified : true;
      const okBoosted = filters.boosted ? !!g.boosted : true;

      return inCat && inQuery && okVerified && okBoosted;
    });
  }, [active, query, filters]);

  return (
    <div className="min-h-screen">
      {/* FIXED header (logo + search bar) — design preserved */}
      <header
        className="fixed top-0 left-0 right-0 z-40 border-b bg-white/80 backdrop-blur"
        style={{ borderColor: "#E6E9F1" }}
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Logo button → landing page (unchanged markup) */}
          <div className="pt-4">
            <Link
              href="/"
              aria-label="Go to NEVILINQ landing page"
              className="inline-flex items-center rounded-full px-2 py-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0300270d]"
            >
              <LogoMark />
            </Link>
          </div>

          {/* Search bar (unchanged look) */}
          <div className="pt-4 pb-4">
            <div className="mx-auto w-full max-w-3xl">
              <div className="relative flex items-center rounded-full border border-[#E6E9F1] bg-white shadow-sm transition focus-within:ring-4 focus-within:ring-[#0300270d]">
                <span className="pl-4">
                  <SearchIcon className="h-5 w-5 text-[#6B7280]" />
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      setSubmitted(true);
                    }
                  }}
                  placeholder="Search groups, channels, hashtags…"
                  className="flex-1 bg-transparent px-3 py-3 text-[15px] outline-none placeholder:text-[#9CA3AF]"
                  aria-label="Search"
                />
                <button
                  type="button"
                  onClick={() => setSubmitted(true)}
                  className="mr-1 inline-flex items-center gap-2 rounded-full bg-[#030027] px-5 py-2.5 text-sm font-medium text-white hover:opacity-95 active:opacity-90"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Page content offset so it doesn't hide behind the fixed header */}
      <div className="pt-36 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Category tabs + Filters (unchanged, just one extra tab) */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="-mx-2 flex w-full gap-1 overflow-x-auto pb-1 md:w-auto md:pb-0">
            {CATEGORIES.map((c) => {
              const isActive = active === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => {
                    setActive(c.key);
                    // keep submitted state
                  }}
                  className={[
                    "mx-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition",
                    isActive
                      ? "border-transparent bg-[#030027] text-white shadow-sm"
                      : "border-[#E6E9F1] bg-white text-[#374151] hover:bg-[#F7F8FA]",
                  ].join(" ")}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          <div className="ml-auto">
            <div className="relative">
              <button
                onClick={() => setOpenFilters((v) => !v)}
                className="inline-flex items-center gap-2 rounded-full border border-[#E6E9F1] bg-white px-4 py-2 text-sm text-[#374151] hover:bg-[#F7F8FA]"
              >
                More filters <ChevronDown className="h-4 w-4" />
              </button>

              {openFilters && (
                <div
                  className="absolute right-0 z-10 mt-2 w-64 rounded-2xl border border-[#E6E9F1] bg-white p-3 shadow-xl"
                  onMouseLeave={() => setOpenFilters(false)}
                >
                  <label className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 hover:bg-[#F7F8FA]">
                    <span className="inline-flex items-center gap-2 text-sm text-[#374151]">
                      <CheckCircle2 className="h-4 w-4" /> Verified
                    </span>
                    <input
                      type="checkbox"
                      checked={filters.verified}
                      onChange={(e) => setFilters((f) => ({ ...f, verified: e.target.checked }))}
                      className="h-4 w-4 accent-[#030027]"
                    />
                  </label>

                  <label className="mt-1 flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 hover:bg-[#F7F8FA]">
                    <span className="inline-flex items-center gap-2 text-sm text-[#374151]">
                      <Rocket className="h-4 w-4" /> Boosted
                    </span>
                    <input
                      type="checkbox"
                      checked={filters.boosted}
                      onChange={(e) => setFilters((f) => ({ ...f, boosted: e.target.checked }))}
                      className="h-4 w-4 accent-[#030027]"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results count (only after a deliberate search action) */}
        {submitted && (
          <div className="mt-3 text-sm text-gray-600">
            {results.length} result{results.length === 1 ? "" : "s"}
            {query.trim() ? (
              <>
                {" "}
                for <span className="font-medium">“{query.trim()}”</span>
              </>
            ) : null}
          </div>
        )}

        {/* Results */}
        <div className="pb-10 pt-4">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((g) => (
              <GroupCard key={g.id} data={g} />
            ))}
          </div>

          {/* ✅ Bottom CTA: show only when filtered results are fewer than 10 */}
          {results.length < 10 && (
            <div className="mt-8 flex justify-center">
              <Link
                href="/pricing"
                className="rounded-full bg-[#030027] px-6 py-3 text-sm font-semibold text-white hover:opacity-95 active:opacity-90"
              >
                List here boss
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
