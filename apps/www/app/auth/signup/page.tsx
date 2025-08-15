// apps/www/app/auth/signup/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User2,
  ShieldCheck,
  Rocket,
  ArrowRight,
  Phone,
} from "lucide-react";
import { api } from "@/lib/api"; // use our API helper object

/** NEVILINQ Brand (LOCKED PALETTE) */
const BRAND = {
  primary: "#030027",
  accent: "#C16E70",
  surface: "#F2F3D9",
  text: "#0E1324",
  bg: "#F7F8FA",
  border: "#E6E9F1",
} as const;

/** Mini wordmark */
function LogoMark() {
  return (
    <Link href="/" className="inline-flex items-center gap-2 group">
      <span className="inline-flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.accent }} />
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.primary }} />
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.accent }} />
      </span>
      <span
        className="font-extrabold tracking-wide group-hover:opacity-90 transition-opacity"
        style={{ color: BRAND.primary }}
      >
        NEVILINQ
      </span>
    </Link>
  );
}

type FormState = {
  name: string;
  email: string;
  password: string;
  whatsapp: string; // required (E.164)
  telegram: string; // optional (E.164 or @username)
  accept: boolean;
};

const phoneRe = /^\+?[1-9]\d{7,14}$/; // permissive E.164 (8–15 digits)

export default function SignupPage() {
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    whatsapp: "",
    telegram: "",
    accept: false,
  });

  const emailOk = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email), [form.email]);
  const waOk = useMemo(() => phoneRe.test(form.whatsapp.trim()), [form.whatsapp]);
  const tgLooksPhone = useMemo(() => /^[+0-9]/.test(form.telegram.trim()), [form.telegram]);
  const tgOk = useMemo(() => {
    const v = form.telegram.trim();
    if (!v) return true;
    return tgLooksPhone ? phoneRe.test(v) : /^@?[a-zA-Z0-9_]{5,32}$/.test(v.replace(/^@/, ""));
  }, [form.telegram, tgLooksPhone]);

  const pwdStrength = useMemo(() => {
    const p = form.password;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return Math.min(score, 4);
  }, [form.password]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerMsg(null);

    if (!form.name.trim()) return setServerMsg("Please enter your full name.");
    if (!emailOk) return setServerMsg("Please enter a valid email address.");
    if (form.password.length < 8) return setServerMsg("Password must be at least 8 characters.");
    if (!waOk) return setServerMsg("Enter a valid WhatsApp number in international format (e.g., +91 98765 43210).");
    if (!tgOk) return setServerMsg("Enter a valid Telegram number (+countrycode…) or username (e.g., @username).");
    if (!form.accept) return setServerMsg("You must accept the Terms & Privacy to continue.");

    try {
      setLoading(true);

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        whatsapp: form.whatsapp.trim(),
        telegram: form.telegram.trim() || undefined,
      };

      // ✅ call the api helper method (not api(...))
      await api.signup(payload);

      router.push("/auth/login?justSignedUp=1");
    } catch (err: any) {
      const msg = String(err?.message || "");
      if (msg.includes("409")) setServerMsg("That email is already registered.");
      else if (msg.includes("400")) setServerMsg("Invalid signup details.");
      else setServerMsg("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.bg }}>
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b" style={{ borderColor: BRAND.border, backgroundColor: BRAND.bg }}>
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <LogoMark />
          <div className="text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold underline decoration-2 underline-offset-4" style={{ color: BRAND.primary }}>
              Log in
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-2 items-stretch">
          {/* Form Card */}
          <section
            className="rounded-3xl shadow-sm p-6 sm:p-8 lg:p-10"
            style={{ backgroundColor: "#fff", border: `1px solid ${BRAND.border}` }}
          >
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: BRAND.text }}>
              Create your account
            </h1>
            <p className="mt-2 text-sm opacity-80" style={{ color: BRAND.text }}>
              List WhatsApp & Telegram groups/channels, boost visibility, and get found via SEO.
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium" style={{ color: BRAND.text }}>
                  Full name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70">
                    <User2 size={18} />
                  </span>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                    className="w-full rounded-xl border px-10 py-3 text-sm outline-none ring-0 focus:border-transparent focus:ring-2"
                    style={{
                      borderColor: BRAND.border,
                      color: BRAND.text,
                      backgroundColor: "#FFF",
                      boxShadow: "0 0 0 0 rgba(0,0,0,0)",
                    }}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium" style={{ color: BRAND.text }}>
                  Email
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70">
                    <Mail size={18} />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                    className="w-full rounded-xl border px-10 py-3 text-sm outline-none ring-0 focus:border-transparent focus:ring-2"
                    style={{
                      borderColor: emailOk ? BRAND.border : "#F3A4A4",
                      color: BRAND.text,
                      backgroundColor: "#FFF",
                    }}
                  />
                </div>
                {!emailOk && form.email.length > 0 && (
                  <p className="text-xs" style={{ color: "#B42318" }}>
                    Enter a valid email address.
                  </p>
                )}
              </div>

              {/* WhatsApp (required) */}
              <div className="space-y-2">
                <label htmlFor="whatsapp" className="text-sm font-medium" style={{ color: BRAND.text }}>
                  WhatsApp number <span className="opacity-60">(required, E.164)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70">
                    <Phone size={18} />
                  </span>
                  <input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    inputMode="tel"
                    placeholder="+91 98765 43210"
                    required
                    value={form.whatsapp}
                    onChange={(e) => setForm((s) => ({ ...s, whatsapp: e.target.value }))}
                    className="w-full rounded-xl border px-10 py-3 text-sm outline-none ring-0 focus:border-transparent focus:ring-2"
                    style={{
                      borderColor: waOk || !form.whatsapp ? BRAND.border : "#F3A4A4",
                      color: BRAND.text,
                      backgroundColor: "#FFF",
                    }}
                  />
                </div>
                {!waOk && form.whatsapp.length > 0 && (
                  <p className="text-xs" style={{ color: "#B42318" }}>
                    Use international format with country code (e.g., +91 98765 43210).
                  </p>
                )}
              </div>

              {/* Telegram (optional) */}
              <div className="space-y-2">
                <label htmlFor="telegram" className="text-sm font-medium" style={{ color: BRAND.text }}>
                  Telegram number or @username <span className="opacity-60">(optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70">
                    <Phone size={18} />
                  </span>
                  <input
                    id="telegram"
                    name="telegram"
                    type="text"
                    placeholder="+91 98765 43210 or @yourhandle"
                    value={form.telegram}
                    onChange={(e) => setForm((s) => ({ ...s, telegram: e.target.value }))}
                    className="w-full rounded-xl border px-10 py-3 text-sm outline-none ring-0 focus:border-transparent focus:ring-2"
                    style={{
                      borderColor: tgOk ? BRAND.border : "#F3A4A4",
                      color: BRAND.text,
                      backgroundColor: "#FFF",
                    }}
                  />
                </div>
                {!tgOk && form.telegram.length > 0 && (
                  <p className="text-xs" style={{ color: "#B42318" }}>
                    Enter a valid number (+countrycode…) or a username like @username.
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium" style={{ color: BRAND.text }}>
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70">
                    <Lock size={18} />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPwd ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
                    className="w-full rounded-xl border px-10 py-3 pr-11 text-sm outline-none ring-0 focus:border-transparent focus:ring-2"
                    style={{
                      borderColor: BRAND.border,
                      color: BRAND.text,
                      backgroundColor: "#FFF",
                    }}
                  />
                  <button
                    type="button"
                    aria-label={showPwd ? "Hide password" : "Show password"}
                    onClick={() => setShowPwd((x) => !x)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100"
                  >
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Strength bar */}
                <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100">
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: `${(pwdStrength / 4) * 100}%`,
                      background: "linear-gradient(to right, indigo, cyan)",
                    }}
                  />
                </div>
                <p className="text-xs opacity-70" style={{ color: BRAND.text }}>
                  Use 8+ chars with a mix of letters, numbers, and a symbol.
                </p>
              </div>

              {/* Accept T&C */}
              <label className="mt-1 flex items-start gap-3 text-sm select-none">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border"
                  checked={form.accept}
                  onChange={(e) => setForm((s) => ({ ...s, accept: e.target.checked }))}
                  style={{ borderColor: BRAND.border }}
                />
                <span className="opacity-90" style={{ color: BRAND.text }}>
                  I agree to the{" "}
                  <Link href="/terms" className="font-medium underline decoration-2 underline-offset-4" style={{ color: BRAND.primary }}>
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="font-medium underline decoration-2 underline-offset-4" style={{ color: BRAND.primary }}>
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              {/* Server message */}
              {serverMsg && (
                <div
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{
                    backgroundColor: "#FFF5F5",
                    color: "#7A271A",
                    border: "1px solid #FAD1CF",
                  }}
                >
                  {serverMsg}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl px-5 py-3 text-sm font-semibold transition-transform active:scale-[0.99] disabled:opacity-60"
                style={{
                  color: "#fff",
                  backgroundImage: "linear-gradient(to right, indigo, cyan)",
                  boxShadow: "0 8px 20px rgba(3, 0, 39, 0.12)",
                }}
              >
                {loading ? "Creating your account…" : "Create account"}
              </button>

              {/* Helper: continue to login */}
              <div className="text-center text-sm">
                <span className="opacity-80" style={{ color: BRAND.text }}>
                  Already on NEVILINQ?{" "}
                </span>
                <Link href="/auth/login" className="font-semibold underline decoration-2 underline-offset-4" style={{ color: BRAND.primary }}>
                  Log in
                </Link>
              </div>
            </form>
          </section>

          {/* Right panel — product glimpse */}
          <aside className="rounded-3xl p-6 sm:p-8 lg:p-10 bg-white/60 backdrop-blur border" style={{ borderColor: BRAND.border }}>
            <div className="flex items-center gap-3">
              <ShieldCheck size={22} style={{ color: BRAND.primary }} />
              <h2 className="text-xl font-bold" style={{ color: BRAND.text }}>
                Why NEVILINQ?
              </h2>
            </div>

            <ul className="mt-5 space-y-4">
              <li className="flex items-start gap-3">
                <span className="mt-1">
                  <Rocket size={18} style={{ color: BRAND.accent }} />
                </span>
                <div>
                  <p className="font-medium" style={{ color: BRAND.text }}>Boost your groups & channels</p>
                  <p className="text-sm opacity-80" style={{ color: BRAND.text }}>
                    Daily/weekly/15-day/30-day boosts to hit the top of search.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1">
                  <ArrowRight size={18} style={{ color: BRAND.accent }} />
                </span>
                <div>
                  <p className="font-medium" style={{ color: BRAND.text }}>SEO discovery</p>
                  <p className="text-sm opacity-80" style={{ color: BRAND.text }}>
                    Google, Bing & Perplexity-ready listings out of the box.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1">
                  <ArrowRight size={18} style={{ color: BRAND.accent }} />
                </span>
                <div>
                  <p className="font-medium" style={{ color: BRAND.text }}>Simple pricing</p>
                  <p className="text-sm opacity-80" style={{ color: BRAND.text }}>
                    3/5/12-group annual bundles. Country-wise pricing, first group free.
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-8">
              <div className="rounded-2xl p-4 border" style={{ borderColor: BRAND.border, backgroundColor: BRAND.surface }}>
                <p className="text-sm leading-relaxed" style={{ color: BRAND.primary }}>
                  “Let customers reach you the moment they’re ready — via your business number or verified group.”
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-xl border px-3 py-2"
                  style={{ borderColor: BRAND.border, color: BRAND.primary, backgroundColor: "#fff" }}
                >
                  View pricing
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-xl border px-3 py-2"
                  style={{ borderColor: BRAND.border, color: BRAND.primary, backgroundColor: "#fff" }}
                >
                  About
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-xl border px-3 py-2"
                  style={{ borderColor: BRAND.border, color: BRAND.primary, backgroundColor: "#fff" }}
                >
                  Blog
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t" style={{ borderColor: BRAND.border, backgroundColor: BRAND.bg }}>
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs opacity-80" style={{ color: BRAND.text }}>
          © {new Date().getFullYear()} NEVILINQ • <Link href="/privacy" className="underline">Privacy Policy</Link> •{" "}
          <Link href="/terms" className="underline">Terms & Conditions</Link> •{" "}
          <Link href="/refund" className="underline">Refund Policy</Link>
        </div>
      </footer>
    </div>
  );
}
