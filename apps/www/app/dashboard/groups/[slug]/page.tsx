import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReviewSection from "@/components/entity/ReviewSection";
import JoinButton from "@/components/entity/JoinButton";

/* Mini logo — same as search */
function LogoMark() {
  return (
    <Link href="/" aria-label="NEVILINQ home" className="inline-flex items-center">
      <span className="mr-2 inline-flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#C16E70" }} />
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#030027" }} />
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#C16E70" }} />
      </span>
      <span className="text-xl font-extrabold tracking-wide" style={{ color: "#030027" }}>NEVILINQ</span>
    </Link>
  );
}

type Item = {
  title: string;
  city?: string;
  verified?: boolean;
  boosted?: boolean;
  members?: number;
  description?: string;
  platform: "whatsapp" | "telegram";
  joinUrl: string;
  tags?: string[];
};

const DB: Record<string, Item> = {
  "hyderabad-startups": {
    title: "Hyderabad Startups",
    city: "Hyderabad",
    verified: true,
    boosted: true,
    members: 1842,
    description: "Daily discussions on fundraising, hiring, GTM, and local founder meetups.",
    platform: "whatsapp",
    joinUrl: "https://wa.me/919000000001",
    tags: ["hyderabad", "startups", "jobs"],
  },
  "mumbai-founders": {
    title: "Mumbai Founders Circle",
    city: "Mumbai",
    boosted: true,
    members: 2360,
    description: "Founder-only chat for Mumbai’s startup scene: intros, pitch review, hiring.",
    platform: "whatsapp",
    joinUrl: "https://wa.me/919000000002",
    tags: ["mumbai", "founders", "pitch", "hiring"],
  },
  "pune-coders": {
    title: "Pune Coders",
    city: "Pune",
    members: 1524,
    description: "Weekly meetups, code reviews, and job drops for Pune developers.",
    platform: "whatsapp",
    joinUrl: "https://wa.me/919000000003",
    tags: ["pune", "coding", "meetups", "jobs"],
  },
  "stock-market-learners": {
    title: "Stock Market Learners",
    city: "India",
    verified: true,
    boosted: true,
    members: 8800,
    description: "Friendly place to learn charts, indicators, and risk management together.",
    platform: "telegram",
    joinUrl: "https://t.me/stock_market_learners",
    tags: ["stocks", "nifty", "learning", "sensex"],
  },
  "jaipur-travel-deals": {
    title: "Jaipur Travel Deals",
    city: "Jaipur",
    members: 5640,
    description: "Best weekend getaways, local experiences, and hotel discounts.",
    platform: "telegram",
    joinUrl: "https://t.me/jaipur_travel_deals",
    tags: ["travel", "deals", "jaipur", "weekend"],
  },
  "remote-react-jobs": {
    title: "Remote React Jobs",
    city: "Remote",
    verified: true,
    members: 2750,
    description: "Daily curated remote React roles with referral-friendly companies.",
    platform: "whatsapp",
    joinUrl: "https://wa.me/919000000004",
    tags: ["react", "remote", "jobs", "frontend"],
  },
};

function buildJoinUrl(base: string, slug: string) {
  try {
    const u = new URL(base);
    u.searchParams.set("utm_source", "nevilinq");
    u.searchParams.set("utm_medium", "join_button");
    u.searchParams.set("utm_campaign", slug);
    return u.toString();
  } catch {
    return base;
  }
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const item = DB[params.slug];
  if (!item) return { title: "Listing not found • NEVILINQ" };

  const title = `${item.title} • ${item.platform === "whatsapp" ? "WhatsApp" : "Telegram"} group`;
  const description = item.description ?? "Discover and join curated communities on NEVILINQ.";
  const url = `https://nevilinq.com/dashboard/groups/${params.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description }
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  const item = DB[params.slug];
  if (!item) return notFound();

  const joinHref = buildJoinUrl(item.joinUrl, params.slug);
  const joinLabel = item.platform === "whatsapp" ? "Join on WhatsApp" : "Join on Telegram";

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* FIXED header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white/90 backdrop-blur" style={{ borderColor: "#E6E9F1" }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <LogoMark />
          <Link href="/search" className="text-sm font-medium text-[#030027]">Marketplace</Link>
        </div>
      </header>

      {/* Page content offset so it doesn't hide behind fixed header */}
      <main className="mx-auto max-w-3xl px-4 pt-28 pb-8">
        <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: "#E6E9F1" }}>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{item.city}</span>
            <span>Group</span>
          </div>
          <h1 className="mt-1 text-xl font-semibold text-[#0E1324]">{item.title}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {item.verified && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Verified</span>}
            {item.boosted && <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">Boosted</span>}
            {item.tags?.map((t) => (
              <span key={t} className="rounded-md border px-2 py-0.5 text-xs" style={{ borderColor: "#E6E9F1", color: "#030027", background: "#F7F8FA" }}>
                #{t}
              </span>
            ))}
          </div>

          {typeof item.members === "number" && (
            <p className="mt-2 text-sm text-gray-600">{item.members.toLocaleString()} members</p>
          )}
          {item.description && <p className="mt-3 text-sm text-gray-700">{item.description}</p>}

          <div className="mt-6">
            <JoinButton href={joinHref} label={joinLabel} slug={params.slug} />
          </div>
        </div>

        {/* Reviews */}
        <ReviewSection slug={params.slug} title={item.title} />

        {/* Back link */}
        <div className="mt-6">
          <Link href="/search" className="text-sm text-[#030027] underline">← Back to results</Link>
        </div>

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: item.title,
              url: `https://nevilinq.com/entity/${params.slug}`,
              areaServed: item.city ?? "India",
              sameAs: item.platform === "telegram" ? [item.joinUrl] : undefined
            })
          }}
        />
      </main>
    </div>
  );
}
