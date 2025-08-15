import Link from "next/link";
import ReviewSection from "../../components/entity/ReviewSection";

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
  "tech-news-india": {
    title: "Tech News India",
    verified: true,
    members: 52100,
    description: "Curated Indian tech headlines, launches, and policy updates in one stream.",
    platform: "telegram",
    joinUrl: "https://t.me/tech_news_india",
    tags: ["technology", "news", "india"],
  },
  "chennai-foodies": {
    title: "Chennai Foodies",
    city: "Chennai",
    boosted: true,
    members: 32000,
    description: "Daily picks of new eateries, reviews, and hidden gems around Chennai.",
    platform: "telegram",
    joinUrl: "https://t.me/chennai_foodies",
    tags: ["chennai", "food", "restaurants", "deals"],
  },
  "cricket-buzz": {
    title: "Cricket Buzz • WhatsApp Channel",
    members: 42000,
    verified: true,
    description: "Fast match updates, squads, and highlights for cricket fans.",
    platform: "whatsapp",
    joinUrl: "https://wa.me/919000000005",
    tags: ["cricket", "ipl", "scores"],
  },
};

export default function Page({ params }: { params: { slug: string } }) {
  const item = DB[params.slug];

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* FIXED header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b bg-white/90 backdrop-blur"
        style={{ borderColor: "#E6E9F1" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <LogoMark />
          <Link href="/search" className="text-sm font-medium text-[#030027]">Marketplace</Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-28 pb-8">
        {!item ? (
          <div className="rounded-2xl border bg-white p-8 text-center text-gray-600" style={{ borderColor: "#E6E9F1" }}>
            Listing not found.
          </div>
        ) : (
          <>
            <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: "#E6E9F1" }}>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{item.city}</span>
                <span>Channel</span>
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
                <p className="mt-2 text-sm text-gray-600">{item.members.toLocaleString()} followers</p>
              )}
              {item.description && <p className="mt-3 text-sm text-gray-700">{item.description}</p>}

              <div className="mt-6">
                <a
                  href={item.joinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-xl bg-[#030027] px-4 py-2 text-center text-sm font-semibold text-white"
                >
                  {item.platform === "whatsapp" ? "Join on WhatsApp" : "Join on Telegram"}
                </a>
              </div>
            </div>

            <ReviewSection slug={params.slug} title={item.title} />
          </>
        )}

        <div className="mt-6">
          <Link href="/search" className="text-sm text-[#030027] underline">← Back to results</Link>
        </div>
      </main>
    </div>
  );
}
