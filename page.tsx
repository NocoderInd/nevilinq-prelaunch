"use client";

/**
 * 🔒 LOCKED FILE (Nevilinq Landing — Page)
 * Location-aware search (no UI changes):
 * - City name detection in free text → ?city=
 * - "near me/nearby/around me" triggers geolocation → ?lat=&lng=&near=1
 */

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * BRAND — hardened
 */
type Brand = {
  primary: string;
  accent: string;
  border: string;
  bg: string;
  text: string;
};

const DEFAULT_BRAND: Readonly<Brand> = Object.freeze({
  primary: "#030027",
  accent: "#C16E70",
  border: "#E6E9F1",
  bg: "#F7F8FA",
  text: "#0E1324",
});

function isHexColor(x: unknown): x is string {
  return typeof x === "string" && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(x);
}
function safeColor(x: unknown, fallback: string): string {
  if (isHexColor(x)) return x;
  return fallback;
}
function resolveBrand(raw: unknown): Brand {
  if (raw && typeof raw === "object") {
    const anyRaw = raw as Record<string, unknown>;
    return Object.freeze({
      primary: safeColor(anyRaw.primary, DEFAULT_BRAND.primary),
      accent: safeColor(anyRaw.accent, DEFAULT_BRAND.accent),
      border: safeColor(anyRaw.border, DEFAULT_BRAND.border),
      bg: safeColor(anyRaw.bg, DEFAULT_BRAND.bg),
      text: safeColor(anyRaw.text, DEFAULT_BRAND.text),
    });
  }
  return Object.freeze({ ...DEFAULT_BRAND });
}
const RUNTIME_BRAND = ((): unknown => {
  try {
    return (globalThis as any)?.__NEVILINQ_BRAND;
  } catch {
    return undefined;
  }
})();
const BRAND: Readonly<Brand> = resolveBrand(RUNTIME_BRAND);

function Wordmark() {
  return (
    <Link href="/" className="inline-flex items-center gap-2 select-none" aria-label="NEVILINQ home">
      <span className="inline-flex items-center gap-1 -translate-y-0.5">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: BRAND.accent }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: BRAND.primary }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: BRAND.accent }} />
      </span>
      <span className="text-lg font-extrabold tracking-tight" style={{ color: BRAND.primary }}>
        NEVILINQ
      </span>
    </Link>
  );
}

function normalizeQuery(s: string) {
  return (s ?? "").trim();
}

/** ------------------------------------------------------------
 * Local suggestion model with hashtag support
 * ------------------------------------------------------------ */
type Kind =
  | "whatsapp_group"
  | "telegram_group"
  | "whatsapp_channel"
  | "telegram_channel"
  | "whatsapp_business";

type Result = {
  id: string;
  title: string;
  type: Kind;
  category?: string;
  city?: string;
  hashtags?: string[];
};

type Suggestion = { kind: "title" | "hashtag" | "category" | "city"; value: string; sourceId?: string };

const CATALOG: Result[] = [
  { id: "w1", title: "Hyderabad Startups • WhatsApp", type: "whatsapp_group", category: "Startups", city: "Hyderabad", hashtags: ["hyderabad", "startups", "jobs", "founders"] },
  { id: "t1", title: "Tech News India • Telegram", type: "telegram_channel", category: "Tech", city: "India", hashtags: ["technology", "news", "india"] },
  { id: "w2", title: "UI/UX Designers • WhatsApp", type: "whatsapp_group", category: "Design", city: "Bengaluru", hashtags: ["design", "figma", "jobs"] },
  { id: "b1", title: "Arun Digital Marketing • WhatsApp Business", type: "whatsapp_business", category: "Marketing", city: "Chennai", hashtags: ["services", "seo", "ads"] },
  { id: "t2", title: "Crypto Signals • Telegram", type: "telegram_group", category: "Finance", city: "Global", hashtags: ["crypto", "signals", "trading"] },
  { id: "w3", title: "Full-Stack Jobs • WhatsApp", type: "whatsapp_group", category: "Jobs", city: "Remote", hashtags: ["jobs", "remote", "nodejs", "react"] },
  { id: "b2", title: "Kiran Electricals • WhatsApp Business", type: "whatsapp_business", category: "Home Services", city: "Hyderabad", hashtags: ["repair", "electrician"] },
  { id: "t3", title: "Stock Market Learners • Telegram", type: "telegram_channel", category: "Finance", city: "India", hashtags: ["stocks", "nifty", "learning"] },
];

/** Unique city list for detection */
const CITY_LIST: string[] = Array.from(
  new Set(CATALOG.map((r) => (r.city || "").trim()).filter(Boolean))
);

/** Find city in free text (case-insensitive) */
function findCityInText(text: string): string | undefined {
  const t = text.toLowerCase();
  return CITY_LIST.find((c) => t.includes(c.toLowerCase()));
}

/** Detect "near me" intent in free text (no UI change) */
function mentionsNearMe(text: string): boolean {
  const t = text.toLowerCase();
  // keep strict to avoid false positives
  return /\bnear me\b|\bnearby\b|\baround me\b/.test(t);
}

/** Promise wrapper for geolocation (silent, no UI elements) */
function getCurrentPosition(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
  });
}

function parseQuery(raw: string): { term: string; isHash: boolean } {
  const t = normalizeQuery(raw);
  const isHash = t.startsWith("#");
  return { term: isHash ? t.slice(1) : t, isHash };
}

function buildSuggestions(q: string, data: Result[]): Suggestion[] {
  const { term, isHash } = parseQuery(q);
  if (!term) return [];
  const s = term.toLowerCase();
  const uniq = new Set<string>();
  const out: Suggestion[] = [];

  // Hashtags first
  for (const r of data) {
    for (const h of r.hashtags || []) {
      if (h.toLowerCase().startsWith(s) && !uniq.has(`#${h}`)) {
        uniq.add(`#${h}`);
        out.push({ kind: "hashtag", value: `#${h}`, sourceId: r.id });
        if (out.length >= 8) return out;
      }
    }
  }

  if (!isHash) {
    // Titles
    for (const r of data) {
      if (r.title.toLowerCase().includes(s) && !uniq.has(r.title)) {
        uniq.add(r.title);
        out.push({ kind: "title", value: r.title, sourceId: r.id });
        if (out.length >= 12) return out;
      }
    }
    // Category / City
    for (const r of data) {
      if (r.category && r.category.toLowerCase().startsWith(s) && !uniq.has(`c:${r.category}`)) {
        uniq.add(`c:${r.category}`);
        out.push({ kind: "category", value: r.category, sourceId: r.id });
        if (out.length >= 12) return out;
      }
      if (r.city && r.city.toLowerCase().startsWith(s) && !uniq.has(`l:${r.city}`)) {
        uniq.add(`l:${r.city}`);
        out.push({ kind: "city", value: r.city, sourceId: r.id });
        if (out.length >= 12) return out;
      }
    }
  }

  return out;
}

export default function Page() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [showSug, setShowSug] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const suggestions = useMemo(() => buildSuggestions(q, CATALOG), [q]);
  useEffect(() => {
    setActiveIndex(-1);
  }, [q, suggestions.length]);
  const year = new Date().getFullYear();

  function pushToSearch(params: { q: string; city?: string; lat?: number; lng?: number; near?: boolean }) {
    const qs = new URLSearchParams();
    if (params.q) qs.set("q", params.q);
    if (params.city) qs.set("city", params.city);
    if (typeof params.lat === "number" && typeof params.lng === "number") {
      qs.set("lat", String(params.lat));
      qs.set("lng", String(params.lng));
      if (params.near) qs.set("near", "1");
    }
    try {
      router.push(`/search?${qs.toString()}`);
    } catch {}
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = normalizeQuery(q);
    if (!query) return;

    // City extraction (e.g., "jobs hyderabad")
    const cityFromText = findCityInText(query);

    // "near me" detection — triggers geolocation silently (no UI added)
    if (mentionsNearMe(query)) {
      try {
        const { lat, lng } = await getCurrentPosition();
        pushToSearch({ q: query, lat, lng, near: true, city: cityFromText || undefined });
        return;
      } catch {
        // If user denies or fails, gracefully fall back
      }
    }

    pushToSearch({ q: query, city: cityFromText || undefined });
  }

  function applySuggestion(s: Suggestion) {
    const text = s.value;
    setQ(text);
    setShowSug(false);
    if (s.kind === "city") {
      pushToSearch({ q: text, city: s.value });
    } else {
      pushToSearch({ q: text });
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: BRAND.bg, color: BRAND.text }}>
      {/* Header */}
      <header className="w-full">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <Wordmark />
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 hover:opacity-95 active:opacity-90"
              style={{ backgroundColor: BRAND.accent }}
            >
              List here boss
            </Link>
          </div>
        </div>
      </header>

      {/* Center content */}
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10 sm:py-16 text-center">
          {/* Headline: single line, same width as search bar */}
          <div className="mx-auto w-full max-w-[560px]">
            <h1
              className="text-2xl sm:text-3xl font-extrabold tracking-tight whitespace-nowrap overflow-hidden text-ellipsis"
              style={{ color: BRAND.primary }}
            >
              Find businesses & communities that match your world
            </h1>
          </div>

          {/* Search – medium width + suggestions */}
          <form onSubmit={onSubmit} className="mt-6 sm:mt-8">
            <div className="mx-auto max-w-[560px] relative">
              <div
                className="flex w-full items-center rounded-full border bg-white px-4 py-2 shadow-sm transition-shadow focus-within:shadow-md"
                style={{ borderColor: BRAND.border }}
              >
                {/* search icon */}
                <svg aria-hidden="true" viewBox="0 0 24 24" className="mr-2 h-4 w-4 opacity-60">
                  <path fill="currentColor" d="M21 20.3l-5.4-5.4a7.5 7.5 0 10-1.4 1.4L20.3 21 21 20.3zM10.5 17a6.5 6.5 0 110-13 6.5 6.5 0 010 13z" />
                </svg>
                <label htmlFor="search" className="sr-only">Search</label>
                <input
                  id="search"
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setShowSug(true);
                    setActiveIndex(-1);
                  }}
                  onFocus={() => setShowSug(true)}
                  onBlur={() => setTimeout(() => setShowSug(false), 120)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setShowSug(true);
                      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setActiveIndex((i) => Math.max(i - 1, 0));
                    } else if (e.key === "Enter") {
                      if (showSug && activeIndex >= 0 && activeIndex < suggestions.length) {
                        e.preventDefault();
                        applySuggestion(suggestions[activeIndex]);
                      }
                    } else if (e.key === "Escape") {
                      setShowSug(false);
                      setActiveIndex(-1);
                    }
                  }}
                  placeholder="Search groups, channels, business numbers or #hashtags"
                  className="h-10 sm:h-11 w-full flex-1 bg-transparent outline-none placeholder-gray-400"
                  autoFocus
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="Search anything"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={showSug}
                  aria-controls="sug-listbox"
                  aria-activedescendant={activeIndex >= 0 ? `sug-${activeIndex}` : undefined}
                />
                <button
                  type="submit"
                  className="ml-2 inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                  style={{ backgroundColor: BRAND.primary }}
                >
                  Search
                </button>
              </div>

              {/* Suggestions — unchanged UI */}
              {showSug && suggestions.length > 0 && (
                <div
                  role="listbox"
                  id="sug-listbox"
                  className="absolute left-0 right-0 z-20 mt-2 max-h-80 overflow-auto rounded-xl border bg-white p-1 text-left shadow-lg"
                  style={{ borderColor: BRAND.border }}
                >
                  {suggestions.map((s, i) => (
                    <button
                      key={`${s.kind}:${s.value}`}
                      id={`sug-${i}`}
                      role="option"
                      aria-selected={activeIndex === i}
                      type="button"
                      onMouseEnter={() => setActiveIndex(i)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applySuggestion(s)}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-50 ${activeIndex === i ? "bg-gray-100" : ""}`}
                    >
                      {/* icon per kind */}
                      {s.kind === "hashtag" ? (
                        <svg viewBox="0 0 24 24" className="h-4 w-4 opacity-60" aria-hidden="true"><path fill="currentColor" d="M10 3l-.7 4H6.3a1 1 0 000 2h2.7l-.6 3H5.3a1 1 0 100 2h2.7L7.3 21a1 1 0 102 0l.7-4h3l-.7 4a1 1 0 102 0l.7-4h3.1a1 1 0 000-2h-2.8l.6-3h2.2a1 1 0 000-2h-2l.7-4a1 1 0 10-2 0l-.7 4h-3l.7-4a1 1 0 10-2 0zM13.3 12l.6-3h-3l-.6 3h3z"/></svg>
                      ) : s.kind === "city" ? (
                        <svg viewBox="0 0 24 24" className="h-4 w-4 opacity-60" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/></svg>
                      ) : s.kind === "category" ? (
                        <svg viewBox="0 0 24 24" className="h-4 w-4 opacity-60" aria-hidden="true"><path fill="currentColor" d="M20.59 13.41L12 4.83l-8.59 8.58L12 22l8.59-8.59zM12 2l10 10-10 10L2 12 12 2z"/></svg>
                      ) : (
                        <svg viewBox="0 0 24 24" className="h-4 w-4 opacity-60" aria-hidden="true"><path fill="currentColor" d="M21 20.3l-5.4-5.4a7.5 7.5 0 10-1.4 1.4L20.3 21 21 20.3zM10.5 17a6.5 6.5 0 110-13 6.5 6.5 0 010 13z"/></svg>
                      )}
                      <span className="truncate">{s.value}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>
      </main>

      {/* Footer pinned to bottom with legal links */}
      <footer className="mt-auto w-full border-t" style={{ borderColor: BRAND.border }}>
        <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-gray-600">
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <span> • </span>
          <Link href="/terms" className="hover:underline">Terms & Conditions</Link>
          <span> • </span>
          <Link href="/refund" className="hover:underline">Refund Policy</Link>
          <div className="mt-1">© {year} NEVILINQ</div>
        </div>
      </footer>
    </div>
  );
}

/* ---------------- Dev-only assertions (light tests) ---------------- */
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  console.assert(!!BRAND && typeof BRAND === "object", "BRAND exists");
  console.assert(isHexColor(BRAND.primary), "BRAND.primary hex");
  console.assert(isHexColor(BRAND.accent), "BRAND.accent hex");
  console.assert(isHexColor(BRAND.border), "BRAND.border hex");
  console.assert(isHexColor(BRAND.bg), "BRAND.bg hex");
  console.assert(isHexColor(BRAND.text), "BRAND.text hex");

  console.assert(parseQuery("").term === "" && parseQuery("").isHash === false, "parseQuery: empty");
  console.assert(parseQuery("#jobs").term === "jobs" && parseQuery("#jobs").isHash === true, "parseQuery: hashtag");

  const s1 = buildSuggestions("job", CATALOG);
  console.assert(Array.isArray(s1) && s1.length >= 1, "suggestions: title/category/city present");
  const s2 = buildSuggestions("#jo", CATALOG);
  console.assert(Array.isArray(s2), "suggestions: hashtag mode");

  console.assert(normalizeQuery("") === "", "normalizeQuery: empty -> ''");
  console.assert(normalizeQuery("   ") === "", "normalizeQuery: whitespace -> ''");

  // City & near-me detection
  console.assert(findCityInText("startups hyderabad")?.toLowerCase() === "hyderabad", "city detection (hyderabad)");
  console.assert(mentionsNearMe("jobs near me") === true, "near me detection");
}
