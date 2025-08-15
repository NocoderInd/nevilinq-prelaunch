"use client";

import { useEffect, useMemo, useState } from "react";
import StarRating from "../common/StarRating";

const BRAND = {
  primary: "#030027",
  border: "#E6E9F1",
  surface: "#FFFFFF",
  text: "#0E1324",
  bg: "#F7F8FA",
};

type Review = {
  id: string;
  rating: number;
  text?: string;
  createdAt: string;
};

type Props = {
  slug: string;          // entity slug from route
  title: string;         // entity title (for heading context)
};

export default function ReviewSection({ slug, title }: Props) {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/entity/${encodeURIComponent(slug)}/reviews`, { cache: "no-store" });
        const json = await res.json();
        if (alive && json?.ok) setList(json.data || []);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [slug]);

  const average = useMemo(() => {
    if (!list.length) return 0;
    const sum = list.reduce((acc, r) => acc + (r.rating || 0), 0);
    return Math.round((sum / list.length) * 10) / 10; // one decimal
  }, [list]);

  async function submitReview() {
    if (!rating) {
      setFlash("Please select a rating.");
      return;
    }
    setPosting(true);
    try {
      const res = await fetch(`/api/entity/${encodeURIComponent(slug)}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, text }),
      });
      const json = await res.json();
      if (!json?.ok) throw new Error(json?.error || "Failed to post review.");
      // refresh list
      const r2 = await fetch(`/api/entity/${encodeURIComponent(slug)}/reviews`, { cache: "no-store" });
      const j2 = await r2.json();
      if (j2?.ok) setList(j2.data || []);
      setRating(0);
      setText("");
      setFlash("Thanks! Your review was posted.");
    } catch (e: any) {
      setFlash(e.message || "Something went wrong.");
    } finally {
      setPosting(false);
      setTimeout(() => setFlash(null), 2500);
    }
  }

  async function submitReport() {
    if (!reportReason) {
      setFlash("Please choose a report reason.");
      return;
    }
    setReporting(true);
    try {
      const res = await fetch(`/api/entity/${encodeURIComponent(slug)}/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reportReason, details: reportDetails }),
      });
      const json = await res.json();
      if (!json?.ok) throw new Error(json?.error || "Failed to send report.");
      setReportReason("");
      setReportDetails("");
      setFlash("Report submitted. Our team will review it.");
    } catch (e: any) {
      setFlash(e.message || "Something went wrong.");
    } finally {
      setReporting(false);
      setTimeout(() => setFlash(null), 2500);
    }
  }

  return (
    <section className="mt-8">
      <div
        className="rounded-2xl border bg-white p-5 shadow-sm"
        style={{ borderColor: BRAND.border }}
      >
        <h2 className="text-base font-semibold" style={{ color: BRAND.text }}>
          Ratings &amp; Reviews
        </h2>

        {/* Summary */}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2">
            <StarRating value={average} readOnly />
            <span className="text-sm text-gray-700">{average || "—"}/5</span>
          </div>
          <span className="text-sm text-gray-500">({list.length} review{list.length === 1 ? "" : "s"})</span>
        </div>

        {/* Write review */}
        <div className="mt-5 rounded-xl border p-4" style={{ borderColor: BRAND.border, background: BRAND.bg }}>
          <label className="block text-sm font-medium text-gray-800">Your rating</label>
          <div className="mt-2">
            <StarRating value={rating} onChange={setRating} />
          </div>

          <label className="mt-4 block text-sm font-medium text-gray-800">Your review <span className="text-gray-500 font-normal">(optional)</span></label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Share your experience with “${title}”`}
            className="mt-1 w-full resize-y rounded-xl border p-3 text-sm outline-none"
            style={{ borderColor: BRAND.border, background: "#fff" }}
            rows={3}
            maxLength={2000}
          />

          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              onClick={submitReview}
              disabled={posting}
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              style={{ background: BRAND.primary }}
            >
              {posting ? "Posting..." : "Post Review"}
            </button>

            {flash && <span className="text-sm text-gray-600">{flash}</span>}
          </div>
        </div>

        {/* Reviews list */}
        <div className="mt-5">
          {loading ? (
            <p className="text-sm text-gray-500">Loading reviews…</p>
          ) : list.length === 0 ? (
            <p className="text-sm text-gray-500">No reviews yet. Be the first to write one!</p>
          ) : (
            <ul className="space-y-3">
              {list.map((r) => (
                <li key={r.id} className="rounded-xl border p-3" style={{ borderColor: BRAND.border }}>
                  <div className="flex items-center justify-between">
                    <StarRating value={r.rating} readOnly size={18} />
                    <span className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</span>
                  </div>
                  {r.text && <p className="mt-2 text-sm text-gray-700">{r.text}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Report box */}
        <div className="mt-6 rounded-xl border p-4" style={{ borderColor: BRAND.border }}>
          <h3 className="text-sm font-semibold" style={{ color: BRAND.text }}>Report this listing</h3>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm"
              style={{ borderColor: BRAND.border, background: "#fff", color: BRAND.text }}
            >
              <option value="">Choose a reason…</option>
              <option value="Spam or misleading">Spam or misleading</option>
              <option value="Fraud or scam">Fraud or scam</option>
              <option value="Abusive or harmful content">Abusive or harmful content</option>
              <option value="Wrong category / info">Wrong category / info</option>
              <option value="Broken or unsafe link">Broken or unsafe link</option>
              <option value="Other">Other</option>
            </select>

            <button
              onClick={submitReport}
              disabled={reporting || !reportReason}
              className="shrink-0 rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              style={{ background: BRAND.primary }}
            >
              {reporting ? "Reporting…" : "Report"}
            </button>
          </div>

          <textarea
            value={reportDetails}
            onChange={(e) => setReportDetails(e.target.value)}
            placeholder="Add details or evidence (optional)"
            className="mt-3 w-full resize-y rounded-xl border p-3 text-sm outline-none"
            style={{ borderColor: BRAND.border, background: "#fff" }}
            rows={2}
            maxLength={2000}
          />
        </div>
      </div>
    </section>
  );
}
