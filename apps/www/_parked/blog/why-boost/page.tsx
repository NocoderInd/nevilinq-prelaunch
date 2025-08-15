/* apps/www/app/blog/why-boost/page.tsx */
import Link from "next/link";
import {
  Rocket,
  LineChart,
  Globe2,
  Search,
  TimerReset,
  Target,
  Eye,
  Handshake,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  BookOpenText,
} from "lucide-react";

/** NEVILINQ brand (LOCKED) */
const BRAND = {
  primary: "#030027",
  accent: "#C16E70",
  surface: "#F2F3D9",
  text: "#0E1324",
  bg: "#F7F8FA",
  border: "#E6E9F1",
} as const;

export const metadata = {
  title: "Why Boost on NEVILINQ? • Blog",
  description:
    "Boosting moves your listing to prime positions for a chosen period (1, 7, 15, or 30 days). Learn when to boost, how it works, and how to calculate ROI.",
  openGraph: {
    title: "Why Boost on NEVILINQ?",
    description:
      "Boosting moves your listing to prime positions for a chosen period (1, 7, 15, or 30 days). Learn when to boost, how it works, and how to calculate ROI.",
    type: "article",
  },
};

export default function WhyBoostArticle() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: BRAND.bg, color: BRAND.text }}>
      {/* Header */}
      <header
        className="sticky top-0 z-30 border-b backdrop-blur supports-[backdrop-filter]:bg-white/70"
        style={{ borderColor: BRAND.border, backgroundColor: "rgba(255,255,255,0.7)" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="font-extrabold tracking-tight" style={{ color: BRAND.primary }}>
            NEVILINQ
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/search"
              className="rounded-xl border px-3.5 py-2 text-sm font-medium hover:shadow"
              style={{ borderColor: BRAND.border }}
            >
              Explore Marketplace
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl px-3.5 py-2 text-sm font-semibold text-white shadow transition-transform hover:-translate-y-0.5"
              style={{
                background:
                  "linear-gradient(90deg, rgba(99,102,241,1) 0%, rgba(34,211,238,1) 100%)",
              }}
            >
              See Boost Plans
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b" style={{ borderColor: BRAND.border }}>
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
                 style={{ borderColor: BRAND.border, backgroundColor: "#fff" }}>
              <Rocket className="h-3.5 w-3.5" />
              Growth Playbook
            </div>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl" style={{ color: BRAND.primary }}>
              Why Boost Your Listing on NEVILINQ?
            </h1>
            <p className="mt-3 text-base text-gray-700">
              Boosting moves your listing to prime positions in search and category pages for a fixed period —
              <strong> 1, 7, 15, or 30 days</strong>. It’s the fastest way to increase views, clicks, and joins or
              contacts, especially during important moments.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Badge icon={Search} label="Higher visibility" />
              <Badge icon={LineChart} label="Predictable reach" />
              <Badge icon={Globe2} label="Country-wise pricing" />
              <Badge icon={ShieldCheck} label="Manual verification" />
            </div>
          </div>
        </div>
      </section>

      {/* TOC */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-6">
          <nav className="rounded-2xl border p-5 text-sm" style={{ borderColor: BRAND.border, backgroundColor: "#fff" }}>
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">In this article</div>
            <ol className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              <TOCItem href="#tldr" text="TL;DR" />
              <TOCItem href="#what-boost-does" text="What boosting does" />
              <TOCItem href="#when-to-boost" text="When to boost" />
              <TOCItem href="#how-it-works" text="How boosting works" />
              <TOCItem href="#roi" text="ROI math (simple)" />
              <TOCItem href="#best-practices" text="Best practices" />
              <TOCItem href="#faq" text="FAQs" />
            </ol>
          </nav>
        </div>
      </section>

      {/* TL;DR */}
      <ArticleSection id="tldr" title="TL;DR">
        <ul className="list-disc space-y-2 pl-5 text-gray-700">
          <li><strong>Boost</strong> pushes your listing above organic results for a chosen duration (1/7/15/30 days).</li>
          <li>Use it to win attention during <em>launches, seasonal spikes, or competitive weeks</em>.</li>
          <li>Pricing is <strong>country-specific</strong>; check the <Link href="/pricing" className="underline">pricing page</Link>.</li>
          <li>Paid joins include a <strong>10% commission</strong> to NEVILINQ (free joins are free).</li>
          <li>Verification is <strong>manual/KYC-style</strong> — no bots involved.</li>
        </ul>
      </ArticleSection>

      {/* What boosting does */}
      <ArticleSection id="what-boost-does" title="What boosting actually does">
        <div className="grid gap-4 md:grid-cols-2">
          <Card
            icon={Eye}
            title="Prime placement"
            desc="Your listing appears in boosted slots on search and category pages, ahead of organic results, for the period you choose."
          />
          <Card
            icon={TrendingUp}
            title="More views → more joins"
            desc="Boosts typically raise impressions and clicks, improving the chances of members joining (groups/channels) or contacting you (business listings)."
          />
        </div>
      </ArticleSection>

      {/* When to boost */}
      <ArticleSection id="when-to-boost" title="When should you boost?">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <MiniCard icon={TimerReset} title="During launch week" desc="Kickstart a new group/channel or business number." />
          <MiniCard icon={Target} title="Category battles" desc="Outcompete similar listings in the same niche." />
          <MiniCard icon={Handshake} title="Collaborations" desc="If you’re cross-promoting with partners, ensure you’re visible." />
          <MiniCard icon={LineChart} title="Seasonal peaks" desc="Festivals, sales, exams, admissions, product releases, etc." />
          <MiniCard icon={CheckCircle2} title="After verification" desc="You’ve passed manual review—boost to capitalize on trust." />
          <MiniCard icon={Search} title="Local surges" desc="City/location trends or hashtag bursts in your category." />
        </div>
      </ArticleSection>

      {/* How it works */}
      <ArticleSection id="how-it-works" title="How boosting works (simple)">
        <ul className="list-disc space-y-2 pl-5 text-gray-700">
          <li><strong>Pick a duration:</strong> 1 day, 7 days, 15 days, or 30 days.</li>
          <li><strong>Placement:</strong> Boosted listings sit in premium slots across search/category pages while active.</li>
          <li><strong>Country-wise pricing:</strong> Fees adapt to purchasing power by country.</li>
          <li><strong>End of term:</strong> Your listing returns to its organic position automatically.</li>
        </ul>
        <p className="mt-4 text-sm text-gray-600">
          Tip: For sustained visibility, chain boosts (e.g., 7-day + 7-day) around your key dates rather than running continuously without purpose.
        </p>
      </ArticleSection>

      {/* ROI */}
      <ArticleSection id="roi" title="ROI math you can copy-paste">
        <div className="rounded-2xl border p-5" style={{ borderColor: BRAND.border, backgroundColor: "#fff" }}>
          <p className="text-gray-700">
            You only need a few inputs to estimate ROI. Replace variables with your numbers:
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg border px-4 py-3 text-sm"
               style={{ borderColor: BRAND.border, backgroundColor: "#fafafa" }}>
{`Views_from_boost × CTR × Join_rate × Revenue_per_join
-----------------------------------------------------  –  Boost_cost
                    Boost_cost
`}
          </pre>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-gray-700">
            <li><strong>Views_from_boost</strong>: extra impressions while boosted</li>
            <li><strong>CTR</strong>: click-through rate from views → listing page</li>
            <li><strong>Join_rate</strong>: visits → joins (or contacts for business)</li>
            <li><strong>Revenue_per_join</strong>: your price per paid join (NEVILINQ takes 10% commission on paid joins)</li>
            <li><strong>Boost_cost</strong>: fee for the chosen duration (see <Link href="/pricing" className="underline">pricing</Link>)</li>
          </ul>
          <p className="mt-3 text-sm text-gray-600">
            If the result &gt; 0, your boost paid for itself. Track real numbers in your dashboard and refine.
          </p>
        </div>
      </ArticleSection>

      {/* Best practices */}
      <ArticleSection id="best-practices" title="Best practices for high-performance boosts">
        <div className="grid gap-4 md:grid-cols-2">
          <Card
            icon={BookOpenText}
            title="Clear, specific titles"
            desc={`Avoid generic names. “Hyderabad Crypto Jobs — Daily Leads” beats “Crypto Group.”`}
          />
          <Card
            icon={Search}
            title="#Hashtags & location"
            desc="Use relevant hashtags and correct city/category so searchers can find you easily."
          />
          <Card
            icon={ShieldCheck}
            title="Manual verification"
            desc="Complete verification quickly—verified badge increases trust and conversions."
          />
          <Card
            icon={TrendingUp}
            title="Time boosts to events"
            desc="Align boosts with launches, seasonal demand, or your content calendar for maximum lift."
          />
        </div>
      </ArticleSection>

      {/* FAQ */}
      <ArticleSection id="faq" title="FAQs">
        <div className="space-y-4">
          <FAQ q="Does boosting guarantee joins or sales?" a="No. Boosting guarantees higher placement and visibility for a period. Conversions depend on your offer, price, and listing quality." />
          <FAQ q="Is boost pricing the same in every country?" a="No. Prices are country-specific based on purchasing power. See the pricing page for your region." />
          <FAQ q="Will boosting affect my organic ranking long term?" a="Boosting is time-bound placement. Once it ends, your listing returns to its organic position. Good engagement while boosted can still help overall momentum." />
          <FAQ q="Do you use bots for verification?" a="No. NEVILINQ uses manual/KYC-style verification and human review." />
          <FAQ q="How does commission work?" a="For paid joins, NEVILINQ charges a 10% commission. Free joins are completely free." />
        </div>
      </ArticleSection>

      {/* CTA */}
      <section className="py-12">
        <div
          className="mx-auto max-w-7xl rounded-2xl px-4 py-10 text-center text-white shadow"
          style={{
            background: "linear-gradient(90deg, rgba(99,102,241,1) 0%, rgba(34,211,238,1) 100%)",
          }}
        >
          <h3 className="text-2xl font-extrabold tracking-tight">Ready to boost your reach?</h3>
          <p className="mx-auto mt-2 max-w-2xl text-sm/6 opacity-90">
            Pick a duration that matches your goal — 1, 7, 15, or 30 days — and climb to premium visibility instantly.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link
              href="/pricing"
              className="rounded-xl bg-white/95 px-4 py-2 text-sm font-semibold text-gray-900 shadow hover:bg-white"
            >
              View Boost Plans
            </Link>
            <Link
              href="/auth/login"
              className="rounded-xl border border-white/60 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              List here boss
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6" style={{ borderColor: BRAND.border }}>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-sm text-gray-600 md:flex-row">
          <p>© {new Date().getFullYear()} NEVILINQ • Privacy Policy • Terms & Conditions • Refund Policy</p>
          <p className="opacity-80">“Paid Groups Platform” • Built with trust, boosts, and SEO</p>
        </div>
      </footer>
    </main>
  );
}

/* ---------- Local UI helpers ---------- */

function Badge({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
      style={{ borderColor: BRAND.border, backgroundColor: "#fff" }}
    >
      <Icon className="h-3.5 w-3.5" style={{ color: BRAND.primary }} />
      {label}
    </span>
  );
}

function TOCItem({ href, text }: { href: string; text: string }) {
  return (
    <li>
      <a href={href} className="text-gray-700 underline-offset-2 hover:underline">
        {text}
      </a>
    </li>
  );
}

function ArticleSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="py-8">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-xl font-bold tracking-tight" style={{ color: BRAND.primary }}>
          {title}
        </h2>
        <div className="prose mt-4 max-w-none text-sm text-gray-800 prose-headings:font-semibold prose-a:text-[inherit]">
          {children}
        </div>
      </div>
    </section>
  );
}

function Card({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: BRAND.border, backgroundColor: "#fff" }}>
      <div
        className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: BRAND.surface }}
      >
        <Icon className="h-5 w-5" style={{ color: BRAND.primary }} />
      </div>
      <div className="text-base font-semibold" style={{ color: BRAND.primary }}>
        {title}
      </div>
      <div className="mt-1 text-sm text-gray-700">{desc}</div>
    </div>
  );
}

function MiniCard({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border p-4" style={{ borderColor: BRAND.border, backgroundColor: "#fff" }}>
      <div className="mb-1 inline-flex items-center gap-2">
        <Icon className="h-4 w-4" style={{ color: BRAND.primary }} />
        <div className="text-sm font-semibold" style={{ color: BRAND.primary }}>
          {title}
        </div>
      </div>
      <div className="text-sm text-gray-700">{desc}</div>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <details className="rounded-2xl border p-4" style={{ borderColor: BRAND.border, backgroundColor: "#fff" }}>
      <summary className="cursor-pointer text-sm font-semibold" style={{ color: BRAND.primary }}>
        {q}
      </summary>
      <p className="mt-2 text-sm text-gray-700">{a}</p>
    </details>
  );
}
