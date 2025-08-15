/* apps/www/app/about/page.tsx */
import Link from "next/link";
import {
  BadgeCheck,
  Rocket,
  ShieldCheck,
  Search,
  Globe2,
  Wallet,
  PlugZap,
  GaugeCircle,
  Layers3,
  PhoneCall,
  Users2,
  Brain,
  Crown,
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

/* Mini logo mark (matches landing style: three dots + wordmark) */
function LogoMark() {
  return (
    <div className="inline-flex items-center">
      <span className="mr-2 inline-flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.accent }} />
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.primary }} />
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.accent }} />
      </span>
      <span className="font-extrabold tracking-tight" style={{ color: BRAND.primary }}>
        NEVILINQ
      </span>
    </div>
  );
}

export const metadata = {
  title: "About • NEVILINQ",
  description:
    "NEVILINQ is the marketplace for WhatsApp & Telegram groups, channels, and WhatsApp business numbers — with verification, boosting, and SEO-first listings.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: BRAND.bg, color: BRAND.text }}>
      {/* Header */}
      <header
        className="sticky top-0 z-30 border-b backdrop-blur supports-[backdrop-filter]:bg-white/70"
        style={{ borderColor: BRAND.border, backgroundColor: "rgba(255,255,255,0.7)" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" aria-label="Back to landing">
            <LogoMark />
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
              href="/auth/login"
              className="rounded-xl px-3.5 py-2 text-sm font-semibold text-white shadow transition-transform hover:-translate-y-0.5"
              style={{
                background:
                  "linear-gradient(90deg, rgba(99,102,241,1) 0%, rgba(34,211,238,1) 100%)",
              }}
            >
              List here boss
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 pt-14 pb-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-extrabold leading-tight md:text-4xl" style={{ color: BRAND.primary }}>
              About NEVILINQ
            </h1>
            {/* Founder caption */}
            <p className="mt-2 text-sm font-medium text-gray-600">
              Founded by <span className="font-semibold">Prasannakumar Bunga</span> — CEO &amp; Brain behind NEVILINQ.
            </p>
            <p className="mt-4 text-base leading-relaxed text-gray-700">
              The marketplace for WhatsApp & Telegram <span className="font-semibold">groups</span>,{" "}
              <span className="font-semibold">channels</span>, and{" "}
              <span className="font-semibold">WhatsApp business numbers</span>. We’re building verified,
              SEO-first listings with boosting — so the right members can find the right communities and
              businesses instantly.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Badge label="Verified listings" Icon={ShieldCheck} />
              <Badge label="Boost to the top" Icon={Rocket} />
              <Badge label="Country-aware pricing" Icon={Globe2} />
              <Badge label="Human review" Icon={BadgeCheck} />
            </div>
          </div>
        </div>
      </section>

      {/* Founder spotlight */}
      <Section title="Founder spotlight">
        <div
          className="grid gap-4 lg:grid-cols-[1fr,2fr] rounded-2xl border p-5"
          style={{ borderColor: BRAND.border, backgroundColor: "#fff" }}
        >
          <div className="flex items-start gap-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl"
                 style={{ backgroundColor: BRAND.surface }}>
              <Crown className="h-6 w-6" style={{ color: BRAND.primary }} />
            </div>
            <div>
              <div className="text-base font-semibold" style={{ color: BRAND.primary }}>
                Prasannakumar Bunga
              </div>
              <div className="text-sm text-gray-600">Founder &amp; CEO</div>
              <div className="mt-2 inline-flex items-center gap-2 text-sm font-medium">
                <Brain className="h-4 w-4" />
                <span>Brain behind NEVILINQ</span>
              </div>
            </div>
          </div>
          <p className="text-sm leading-6 text-gray-700">
            Sets the product vision, pricing model, and go-to-market strategy. Drives a world-class UX, SEO-first
            discovery, and country-aware pricing so NEVILINQ scales globally without bloat. Focused on speed,
            clarity, and building trust through transparent verification and boosting.
          </p>
        </div>
      </Section>

      {/* What we do */}
      <Section title="What we do">
        <Grid>
          <Feature
            icon={Search}
            title="Discovery that actually works"
            desc="Smart search with #hashtags, category & location. Every listing gets a clean SEO landing page."
          />
          <Feature
            icon={ShieldCheck}
            title="Trust by design"
            desc="Verification via ownership proof (screenshot, invite or admin proof), document checks, and manual reviewer approval."
          />
          <Feature
            icon={Rocket}
            title="Boost when it matters"
            desc="Daily, weekly, 15-day, and 30-day boosts to increase visibility during peak moments."
          />
          <Feature
            icon={Wallet}
            title="Monetize with confidence"
            desc="Paid group joins supported; NEVILINQ may charge a platform commission on paid joins (free joins are free)."
          />
          <Feature
            icon={PlugZap}
            title="Simple onboarding"
            desc="Sign up with your WhatsApp number, pick a bundle, submit verification, and publish your listing in minutes."
          />
          <Feature
            icon={Layers3}
            title="Multi-format listings"
            desc="WhatsApp/Telegram groups & channels, plus WhatsApp business number listings."
          />
        </Grid>
      </Section>

      {/* Pricing snapshot (India) */}
      <Section title="Pricing snapshot (India)">
        <div
          className="overflow-hidden rounded-2xl border"
          style={{ borderColor: BRAND.border, backgroundColor: "#fff" }}
        >
          <table className="w-full text-left">
            <thead className="text-sm" style={{ backgroundColor: BRAND.bg }}>
              <tr className="text-gray-600">
                <th className="px-5 py-4 font-semibold">Bundle</th>
                <th className="px-5 py-4 font-semibold">What you get</th>
                <th className="px-5 py-4 font-semibold">Annual platform fee</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: BRAND.border }}>
              <Row
                name="3 Groups"
                details="First group free • Add 2 more (total 3) • Manual verification • SEO page & analytics"
                price="₹3,800 / year"
              />
              <Row
                name="5 Groups"
                details="Manage up to 5 groups or channels • Manual verification & SEO benefits"
                price="₹5,400 / year"
              />
              <Row
                name="12 Groups"
                details="Scale to 12 groups or channels • Best value per group"
                price="₹10,800 / year"
              />
              <Row
                name="WhatsApp Business Number"
                details="Category + city listing • Boost eligible • SEO landing"
                price="₹2,499 / year"
              />
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-gray-600">
          Prices auto-adjust by country based on purchasing power. Boost plans are also country-specific.
        </p>
      </Section>

      {/* How NEVILINQ works */}
      <Section title="How NEVILINQ works">
        <Steps />
      </Section>

      {/* Why trust us */}
      <Section title="Why trust us">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            icon={GaugeCircle}
            title="Fast SEO footprint"
            desc="Each listing renders a performant, indexable landing page with structured data and sitemaps."
          />
          <Card
            icon={Users2}
            title="Real communities"
            desc="We verify ownership and legitimacy via human review, community reports, and periodic rechecks."
          />
          <Card
            icon={PhoneCall}
            title="Instant business contact"
            desc="Let customers reach you on your WhatsApp business number the moment they’re ready."
          />
        </div>
      </Section>

      {/* Team */}
      <Section title="The crew behind NEVILINQ">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <TeamCard
            name="Mike"
            role="CTO • Full-Stack • Product"
            blurb="Owns end-to-end build quality and delivery. Obsessive about zero-error releases."
          />
          <TeamCard
            name="Levin"
            role="Gen-Z UI/UX"
            blurb="Designs with Refactoring UI principles for crisp, modern interfaces."
          />
          <TeamCard
            name="Jack"
            role="Marketing Strategist"
            blurb="Turns NEVILINQ into a self-marketing machine on zero budget."
          />
          <TeamCard
            name="Zeal"
            role="Research Scientist"
            blurb="Advises decisions with data; bakes virality into the product."
          />
          <TeamCard
            name="Sam"
            role="Infrastructure & Reliability"
            blurb="Keeps the platform fast, secure, and resilient across regions."
          />
          <TeamCard
            name="Finn"
            role="Finance Analyst"
            blurb="Models sustainable pricing and boosts with a sharp ROI lens."
          />
          <TeamCard
            name="Jash"
            role="Backend Lead"
            blurb="Deploys rock-solid APIs and automation at pro level."
          />
          <TeamCard
            name="Nevi"
            role="Product Architect"
            blurb="Designs scalable, addictive architectures that stay robust."
          />
        </div>
      </Section>

      {/* CTA */}
      <section className="py-12">
        <div
          className="mx-auto max-w-7xl rounded-2xl px-4 py-10 text-center text-white shadow"
          style={{
            background: "linear-gradient(90deg, rgba(99,102,241,1) 0%, rgba(34,211,238,1) 100%)",
          }}
        >
          <h3 className="text-2xl font-extrabold tracking-tight">Ready to list?</h3>
          <p className="mx-auto mt-2 max-w-2xl text-sm/6 opacity-90">
            Create your verified listing, boost visibility when needed, and grow your community or business.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link
              href="/auth/login"
              className="rounded-xl bg-white/95 px-4 py-2 text-sm font-semibold text-gray-900 shadow hover:bg-white"
            >
              List here boss
            </Link>
            <Link
              href="/search"
              className="rounded-xl border border-white/60 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Explore marketplace
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

/* ---------- UI bits ---------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-xl font-bold tracking-tight" style={{ color: BRAND.primary }}>
          {title}
        </h2>
        <div className="mt-5">{children}</div>
      </div>
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

function Feature({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: BRAND.border, backgroundColor: "#fff" }}>
      <div
        className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: BRAND.surface }}
      >
        <Icon className="h-5 w-5" style={{ color: BRAND.primary }} />
      </div>
      <h3 className="text-base font-semibold" style={{ color: BRAND.primary }}>
        {title}
      </h3>
      <p className="mt-1 text-sm text-gray-700">{desc}</p>
    </div>
  );
}

function Badge({ label, Icon }: { label: string; Icon: any }) {
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

function Row({ name, details, price }: { name: string; details: string; price: string }) {
  return (
    <tr className="align-top">
      <td className="px-5 py-4 font-medium" style={{ color: BRAND.primary }}>
        {name}
      </td>
      <td className="px-5 py-4 text-sm text-gray-700">{details}</td>
      <td className="px-5 py-4 whitespace-nowrap text-sm font-semibold" style={{ color: BRAND.primary }}>
        {price}
      </td>
    </tr>
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
      <h3 className="text-base font-semibold" style={{ color: BRAND.primary }}>
        {title}
      </h3>
      <p className="mt-1 text-sm text-gray-700">{desc}</p>
    </div>
  );
}

function TeamCard({ name, role, blurb }: { name: string; role: string; blurb: string }) {
  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: BRAND.border, backgroundColor: "#fff" }}>
      <div className="mb-2 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl" style={{ backgroundColor: BRAND.surface }} />
        <div>
          <div className="text-sm font-semibold" style={{ color: BRAND.primary }}>
            {name}
          </div>
          <div className="text-xs text-gray-600">{role}</div>
        </div>
      </div>
      <p className="text-sm text-gray-700">{blurb}</p>
    </div>
  );
}

function Steps() {
  const items = [
    { t: "Create your account", d: "Use your WhatsApp number & password to sign up." },
    { t: "Pick a bundle", d: "3, 5, or 12 groups/channels. First group is free and added to your bundle." },
    {
      t: "Submit verification",
      d: "Provide ownership proof (admin screenshot/invite), basic KYC if required, and pass manual review.",
    },
    { t: "Publish your listing", d: "Clean SEO page, #hashtags, category & city for discovery." },
    { t: "Boost when needed", d: "Daily, weekly, 15-day, or 30-day boosts to climb the ranks." },
    { t: "Get members & sales", d: "Free joins are free; paid joins may include a platform commission." },
  ];
  return (
    <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((x, i) => (
        <li key={i} className="rounded-2xl border p-5" style={{ borderColor: BRAND.border, backgroundColor: "#fff" }}>
          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Step {i + 1}</div>
          <div className="text-base font-semibold" style={{ color: BRAND.primary }}>
            {x.t}
          </div>
          <div className="mt-1 text-sm text-gray-700">{x.d}</div>
        </li>
      ))}
    </ol>
  );
}
