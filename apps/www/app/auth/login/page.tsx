"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Rocket,
  ShieldCheck,
  Wallet,
  BookOpen,
} from "lucide-react";
import { api } from "@/lib/api";

/** Brand (LOCKED) */
const BRAND = {
  primary: "#030027",
  accent: "#C16E70",
  surface: "#F2F3D9",
  text: "#0E1324",
  bg: "#F7F8FA",
  border: "#E6E9F1",
} as const;

const phoneRe = /^\+?[1-9]\d{7,14}$/; // permissive E.164

export default function LoginPrime() {
  const router = useRouter();
  const search = useSearchParams();
  const redirectTo = search?.get("redirect") || "/dashboard";

  const [identifier, setIdentifier] = useState(""); // email or phone
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const idHelp = useMemo(() => {
    if (!identifier) return "";
    const looksEmail = /.+@.+\..+/.test(identifier);
    const looksPhone = phoneRe.test(identifier.trim());
    return looksEmail || looksPhone ? "Looks good." : "Enter a valid email or +countrycode number";
  }, [identifier]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const looksEmail = /.+@.+\..+/.test(identifier);
    const looksPhone = phoneRe.test(identifier.trim());
    if (!looksEmail && !looksPhone) {
      setError("Enter a valid email or WhatsApp number (E.164).");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      // ✅ call a method on the api object (not api(...))
      const res = await api.loginPrime({
        identifier: identifier.trim(),
        password,
      });

      // res: { access_token, token_type, user }
      if (res?.access_token) {
        // Remember me -> localStorage; otherwise -> sessionStorage
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem("nevilinq_token", res.access_token);
      }
      setOk(true);
      setTimeout(() => router.push(redirectTo), 320);
    } catch (err: any) {
      const t = String(err?.message || "");
      if (t.includes("401")) setError("Invalid email/number or password.");
      else if (t.includes("404")) setError("Login service not found. Check API path.");
      else setError("We couldn't reach the server. Please try again.");
      setOk(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ color: BRAND.text }}>
      {/* BACKGROUND */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(900px 600px at 10% -10%, ${BRAND.surface} 0%, transparent 55%), radial-gradient(900px 600px at 110% 0%, ${BRAND.accent}20 0%, transparent 55%), linear-gradient(180deg, ${BRAND.bg}, #ffffff)`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #0E1324 1px, transparent 1px), linear-gradient(to bottom, #0E1324 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* TOP BAR */}
      <header
        className="sticky top-0 z-30 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60"
        style={{ borderColor: BRAND.border }}
      >
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Back to home">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.accent }} />
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.primary }} />
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.accent }} />
              </span>
              <span className="font-semibold tracking-tight">NEVILINQ</span>
            </Link>
            <nav className="hidden items-center gap-6 text-sm sm:flex">
              <Link href="/pricing" className="hover:opacity-90" style={{ color: BRAND.primary }}>
                Pricing
              </Link>
              <Link href="/about" className="hover:opacity-90" style={{ color: BRAND.primary }}>
                About
              </Link>
              <Link href="/blog" className="hover:opacity-90" style={{ color: BRAND.primary }}>
                Blog
              </Link>
              <Link href="/" className="inline-flex items-center gap-2 text-xs hover:opacity-90" style={{ color: BRAND.primary }}>
                <ArrowLeft className="h-4 w-4" /> Back
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* CARD */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <section
          className="relative overflow-hidden rounded-[28px] border bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(3,0,39,0.10)]"
          style={{ borderColor: BRAND.border }}
        >
          <div className="nevi-ribbon h-1 w-full" />

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* LEFT */}
            <div className="col-span-12 lg:col-span-6 p-6 sm:p-10">
              <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                List here, boss.
                <span className="mt-2 block text-base font-normal opacity-80 md:text-lg">
                  A premium marketplace to list WhatsApp & Telegram groups, channels, and business numbers — with verified trust, boosts, and SEO-ready pages.
                </span>
              </h1>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="tile rounded-2xl border bg-white p-4 shadow-sm" style={{ borderColor: BRAND.border }}>
                  <div className="mb-2 inline-flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-sm font-semibold">Why NEVILINQ</span>
                  </div>
                  <p className="text-sm leading-5 opacity-80">Be discoverable via search, hashtags, and location. Turn attention into joins.</p>
                  <Link href="/about" className="mt-2 inline-block text-xs underline" style={{ color: BRAND.primary }}>
                    About us
                  </Link>
                </div>

                <div className="tile rounded-2xl border bg-white p-4 shadow-sm" style={{ borderColor: BRAND.border }}>
                  <div className="mb-2 inline-flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    <span className="text-sm font-semibold">Pricing (India)</span>
                  </div>
                  <ul className="text-sm opacity-80">
                    <li>3 groups — ₹3,600 / year</li>
                    <li>5 groups — ₹5,400 / year</li>
                    <li>12 groups — ₹10,800 / year</li>
                  </ul>
                  <Link href="/pricing" className="mt-2 inline-block text-xs underline" style={{ color: BRAND.primary }}>
                    See full pricing
                  </Link>
                </div>

                <div className="tile rounded-2xl border bg-white p-4 shadow-sm" style={{ borderColor: BRAND.border }}>
                  <div className="mb-2 inline-flex items-center gap-2">
                    <Rocket className="h-4 w-4" />
                    <span className="text-sm font-semibold">Boost plans</span>
                  </div>
                  <p className="text-sm leading-5 opacity-80">Daily, weekly, 15-day, or 30-day boosts to climb listings when it matters.</p>
                  <Link href="/blog/why-boost" className="mt-2 inline-block text-xs underline" style={{ color: BRAND.primary }}>
                    How boosting works
                  </Link>
                </div>

                <div className="tile rounded-2xl border bg-white p-4 shadow-sm" style={{ borderColor: BRAND.border }}>
                  <div className="mb-2 inline-flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm font-semibold">From the blog</span>
                  </div>
                  <ul className="list-disc pl-4 text-sm leading-6 opacity-80">
                    <li>Verified badges: trust that converts</li>
                    <li>Location-aware discovery 101</li>
                    <li>Designing winning group pages</li>
                  </ul>
                  <Link href="/blog" className="mt-2 inline-block text-xs underline" style={{ color: BRAND.primary }}>
                    Visit blog
                  </Link>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
                <span className="chip">SEO-ready pages</span>
                <span className="chip">Trust & verification</span>
                <span className="chip">Boost your reach</span>
              </div>
            </div>

            {/* RIGHT: Auth */}
            <div className="col-span-12 lg:col-span-6 border-t lg:border-l lg:border-t-0" style={{ borderColor: BRAND.border }}>
              <div className="h-full p-6 sm:p-10">
                <div className="mx-auto w-full max-w-md">
                  <h2 className="text-xl font-semibold tracking-tight">Sign in to NEVILINQ</h2>
                  <p className="mt-1 text-sm opacity-80">Email or WhatsApp number + password.</p>

                  <form onSubmit={onSubmit} className="mt-6 space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="identifier" className="text-sm font-medium">
                        Email or WhatsApp number
                      </label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
                        <input
                          id="identifier"
                          autoComplete="username"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder="you@company.com or +91 98765 43210"
                          className="w-full rounded-xl border bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:ring-4"
                          style={{ borderColor: BRAND.border }}
                        />
                      </div>
                      {idHelp && <p className="text-xs opacity-70">{idHelp}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="password" className="text-sm font-medium">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
                        <input
                          id="password"
                          type={show ? "text" : "password"}
                          autoComplete="current-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full rounded-xl border bg-white py-2.5 pl-10 pr-10 text-sm outline-none transition focus:ring-4"
                          style={{ borderColor: BRAND.border }}
                        />
                        <button
                          type="button"
                          onClick={() => setShow((s) => !s)}
                          aria-label={show ? "Hide password" : "Show password"}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 hover:bg-gray-50"
                        >
                          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="inline-flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border"
                          style={{ borderColor: BRAND.border }}
                          checked={remember}
                          onChange={(e) => setRemember(e.target.checked)}
                        />
                        Remember me
                      </label>
                      <Link href="/auth/forgot" className="text-sm underline" style={{ color: BRAND.primary }}>
                        Forgot password?
                      </Link>
                    </div>

                    {error && (
                      <div
                        role="alert"
                        aria-live="polite"
                        className="flex items-start gap-2 rounded-lg border p-3 text-sm"
                        style={{ borderColor: BRAND.border, background: "#FFF5F5" }}
                      >
                        <span className="mt-0.5">⚠️</span>
                        <p className="leading-5">{error}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="nevi-btn inline-flex h-11 w-full items-center justify-center rounded-xl px-4 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-4 disabled:opacity-70"
                    >
                      {loading ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" /> Signing you in…
                        </span>
                      ) : ok ? (
                        <span className="inline-flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" /> Success! Redirecting…
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          <Rocket className="h-4 w-4" /> Sign in
                        </span>
                      )}
                    </button>

                    <p className="text-center text-sm">
                      New here?{" "}
                      <Link className="font-medium underline" href="/auth/signup" style={{ color: BRAND.primary }}>
                        Create an account
                      </Link>
                    </p>
                    <p className="text-center text-xs opacity-70">
                      By continuing, you agree to our <Link className="underline" href="/terms">Terms</Link> and{" "}
                      <Link className="underline" href="/privacy">Privacy Policy</Link>.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER MICRO NAV */}
        <div
          className="mt-10 rounded-2xl border bg-white/70 px-4 py-3 text-xs opacity-80 backdrop-blur"
          style={{ borderColor: BRAND.border }}
        >
          © {new Date().getFullYear()} NEVILINQ • <Link className="underline" href="/privacy">Privacy</Link> •{" "}
          <Link className="underline" href="/terms">Terms</Link> • <Link className="underline" href="/refund">Refunds</Link>
        </div>
      </main>

      {/* Inline CSS */}
      <style jsx>{`
        .nevi-ribbon {
          background: linear-gradient(90deg, ${BRAND.primary}, ${BRAND.accent}, ${BRAND.primary});
          background-size: 200% 100%;
          animation: ribbonMove 10s ease-in-out infinite;
        }
        @keyframes ribbonMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .chip {
          display: inline-flex; align-items: center; gap: 6px;
          border: 1px solid ${BRAND.border};
          background: #fff; padding: 6px 10px; border-radius: 999px;
        }
        .tile { transition: transform .25s ease, box-shadow .25s ease; }
        .tile:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(3,0,39,.08); }
        .nevi-btn {
          background: linear-gradient(90deg, ${BRAND.primary}, ${BRAND.accent}, ${BRAND.primary});
          background-size: 200% 100%;
          animation: btnSheen 6s ease-in-out infinite;
        }
        @keyframes btnSheen { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
      `}</style>
    </div>
  );
}
